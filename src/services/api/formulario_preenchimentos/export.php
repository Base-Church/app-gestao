<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

function returnJsonError($message, $code = 400) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode(['error' => $message]);
    exit;
}

SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnJsonError('Não autorizado', 401);
}
if (!SessionService::hasToken()) {
    returnJsonError('Token de autenticação não encontrado', 401);
}

// Accept both GET and POST
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($method, ['GET', 'POST'])) {
    returnJsonError('Método não permitido', 405);
}

$ids = [];
if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $parsed = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($parsed) && isset($parsed['ids'])) {
        $ids = $parsed['ids'];
    } else {
        if (isset($_POST['ids'])) {
            $ids = is_array($_POST['ids']) ? $_POST['ids'] : array_filter(array_map('trim', explode(',', (string)$_POST['ids'])));
        }
    }
} else {
    if (isset($_GET['ids'])) {
        $ids = is_array($_GET['ids']) ? $_GET['ids'] : array_filter(array_map('trim', explode(',', (string)$_GET['ids'])));
    }
}

$ids = array_values(array_unique(array_filter($ids, function($v){ return $v !== '' && $v !== null; })));
if (empty($ids)) {
    returnJsonError('Nenhum item selecionado para exportação');
}

$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = $_GET['ministerio_id'] ?? SessionService::getMinisterioAtual();
$formulario_id = $_GET['formulario_id'] ?? null;

if (!$organizacao_id) returnJsonError('Organização não identificada');
if (!$ministerio_id) returnJsonError('Ministério não informado');

// Buscar formulário
$formulario = null;
if ($formulario_id) {
    $params = http_build_query([
        'organizacao_id' => $organizacao_id,
        'ministerio_id' => $ministerio_id,
    ]);
    $url = $_ENV['API_BASE_URL'] . '/formularios/' . urlencode($formulario_id) . '?' . $params;
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
            'Authorization: Bearer ' . SessionService::getToken()
        ]
    ]);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($resp && $code < 400) {
        $j = json_decode($resp, true);
        if ($j) $formulario = $j['data'] ?? $j;
    }
}

// Buscar preenchimentos
$items = [];
foreach ($ids as $pid) {
    $params = [
        'organizacao_id' => $organizacao_id,
        'ministerio_id' => $ministerio_id,
    ];
    if ($formulario_id) $params['formulario_id'] = $formulario_id;
    $url = $_ENV['API_BASE_URL'] . '/formulario_preenchimentos/' . urlencode($pid) . '?' . http_build_query($params);
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
            'Authorization: Bearer ' . SessionService::getToken()
        ]
    ]);
    $resp = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if (!curl_errno($ch) && $httpCode < 400) {
        $data = json_decode($resp, true);
        $item = $data['data'] ?? $data;
        if ($item) $items[] = $item;
    }
    curl_close($ch);
}

if (empty($items)) {
    returnJsonError('Nenhum dado encontrado para exportação');
}

// Usar CSV como fallback se PhpSpreadsheet não funcionar
$useCSV = true;
$useExcel = false;

// Tentar usar PhpSpreadsheet se disponível
if (class_exists('PhpOffice\PhpSpreadsheet\Spreadsheet')) {
    try {
        $useExcel = true;
        $useCSV = false;
    } catch (Exception $e) {
        $useCSV = true;
        $useExcel = false;
    }
}

// Montar colunas
$columns = [];
if ($formulario && isset($formulario['dados']['elements']) && is_array($formulario['dados']['elements'])) {
    foreach ($formulario['dados']['elements'] as $el) {
        $elementType = $el['type'] ?? 'text';
        if (!in_array($elementType, ['select-ui', 'index', 'actions'])) {
            $columns[] = [
                'source' => 'element',
                'id' => $el['id'] ?? null,
                'label' => $el['properties']['label'] ?? ($el['id'] ?? 'Campo'),
                'type' => $elementType,
            ];
        }
    }
}

// Campos fixos - verificar duplicatas
$fixedFields = [
    ['source' => 'fixed', 'key' => 'nome', 'label' => 'Nome', 'type' => 'nome'],
    ['source' => 'fixed', 'key' => 'cpf', 'label' => 'CPF', 'type' => 'cpf'],
    ['source' => 'fixed', 'key' => 'whatsapp', 'label' => 'WhatsApp', 'type' => 'whatsapp'],
    ['source' => 'fixed', 'key' => 'data_nascimento', 'label' => 'Data Nascimento', 'type' => 'birthdate'],
    ['source' => 'fixed', 'key' => 'created_at', 'label' => 'Enviado', 'type' => 'datetime'],
];

foreach ($fixedFields as $field) {
    $exists = false;
    foreach ($columns as $existingCol) {
        if ($existingCol['type'] === $field['type'] || 
            (isset($existingCol['label']) && strtolower($existingCol['label']) === strtolower($field['label']))) {
            $exists = true;
            break;
        }
    }
    if (!$exists) {
        $columns[] = $field;
    }
}

if ($useExcel && class_exists('PhpOffice\PhpSpreadsheet\Spreadsheet')) {
    // Export Excel
    try {
        $spreadsheet = new PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header
        $colIndex = 1;
        foreach ($columns as $col) {
            $sheet->setCellValueByColumnAndRow($colIndex, 1, $col['label']);
            $colIndex++;
        }

        // Dados
        $rowIndex = 2;
        foreach ($items as $p) {
            $colIndex = 1;
            foreach ($columns as $col) {
                $value = '';
                if ($col['source'] === 'element') {
                    $id = $col['id'];
                    $raw = isset($p['dados'][$id]) ? $p['dados'][$id] : '';
                    $value = is_scalar($raw) ? (string)$raw : json_encode($raw, JSON_UNESCAPED_UNICODE);
                } else {
                    $key = $col['key'];
                    if ($key === 'created_at') {
                        $value = isset($p['created_at']) ? (new DateTime($p['created_at']))->format('d/m/Y H:i') : '';
                    } else {
                        $value = isset($p[$key]) ? (string)$p[$key] : '';
                    }
                }
                $sheet->setCellValueByColumnAndRow($colIndex, $rowIndex, $value);
                $colIndex++;
            }
            $rowIndex++;
        }

        // Auto-width
        foreach (range(1, count($columns)) as $col) {
            $sheet->getColumnDimensionByColumn($col)->setAutoSize(true);
        }

        $fileName = 'preenchimentos_' . date('Ymd_His') . '.xlsx';
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        header('Cache-Control: max-age=0');

        $writer = new PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save('php://output');
        exit;
    } catch (Exception $e) {
        // Fallback para CSV
        $useCSV = true;
    }
}

if ($useCSV) {
    // Export CSV
    $fileName = 'preenchimentos_' . date('Ymd_His') . '.csv';
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $fileName . '"');
    header('Cache-Control: max-age=0');

    $output = fopen('php://output', 'w');
    
    // BOM for UTF-8
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    // Header
    $headers = [];
    foreach ($columns as $col) {
        $headers[] = $col['label'];
    }
    fputcsv($output, $headers, ';');
    
    // Dados
    foreach ($items as $p) {
        $row = [];
        foreach ($columns as $col) {
            $value = '';
            if ($col['source'] === 'element') {
                $id = $col['id'];
                $raw = isset($p['dados'][$id]) ? $p['dados'][$id] : '';
                $value = is_scalar($raw) ? (string)$raw : json_encode($raw, JSON_UNESCAPED_UNICODE);
            } else {
                $key = $col['key'];
                if ($key === 'created_at') {
                    $value = isset($p['created_at']) ? (new DateTime($p['created_at']))->format('d/m/Y H:i') : '';
                } else {
                    $value = isset($p[$key]) ? (string)$p[$key] : '';
                }
            }
            $row[] = $value;
        }
        fputcsv($output, $row, ';');
    }
    
    fclose($output);
    exit;
}

returnJsonError('Erro interno na exportação');
?>
