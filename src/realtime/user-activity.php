<?php
// src/realtime/user-activity.php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok'=>false,'error'=>'method_not_allowed']); exit;
}

$DATA_FILE = __DIR__ . '/users_online.json';
@mkdir(dirname($DATA_FILE), 0777, true);

$body = json_decode(file_get_contents('php://input') ?: '[]', true) ?? [];
$sessionId     = $body['sessionId']     ?? null;
$userId        = $body['userId']        ?? null;
$userName      = $body['userName']      ?? null;
$organizacaoId = $body['organizacaoId'] ?? null;
$currentPage   = $body['currentPage']   ?? null;
$activity      = $body['activity']      ?? 'active';
$tabActive     = (bool)($body['tabActive'] ?? true);
$status        = $body['status']        ?? 'online';

// Debug para verificar o payload recebido
error_log('Payload recebido: ' . json_encode($body));

if (!$sessionId) {
  error_log('Validação falhou: sessionId=' . ($sessionId ?: 'null') . ', userId=' . ($userId ?: 'null') . ', userName=' . ($userName ?: 'null') . ', organizacaoId=' . ($organizacaoId ?: 'null'));
  http_response_code(422);
  echo json_encode(['ok'=>false,'error'=>'invalid_payload','debug'=>compact('sessionId','userId','userName','organizacaoId')]); exit;
}

// Carrega estado atual
$users = [];
if (is_file($DATA_FILE)) {
  $users = json_decode(file_get_contents($DATA_FILE) ?: '{}', true) ?? [];
}

$nowIso = gmdate('c');
$existing = $users[$sessionId] ?? [];
$users[$sessionId] = array_merge($existing, [
  'userId'        => $userId ?: 'user_' . substr($sessionId, 0, 8),
  'userName'      => $userName ?: 'Usuário',
  'organizacaoId' => $organizacaoId,
  'currentPage'   => $currentPage ?: ($existing['currentPage'] ?? 'inicio'),
  'status'        => $status,
  'activity'      => $activity,
  'tabActive'     => $tabActive,
  'socketId'      => $existing['socketId'] ?? null, // mantido por compat
  'connectedAt'   => $existing['connectedAt'] ?? $nowIso,
  'lastActivity'  => $nowIso,
  'disconnectedAt'=> ($status==='offline') ? $nowIso : null,
]);

// Grava com lock
$fp = fopen($DATA_FILE, 'c+');
if (!$fp) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'fs_open']); exit; }
flock($fp, LOCK_EX);
ftruncate($fp, 0);
fwrite($fp, json_encode($users, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

echo json_encode(['ok'=>true,'total'=>count($users)]);
