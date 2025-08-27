<?php
// src/realtime/realtime.stream.php
declare(strict_types=1);

// Desligar exibição de erros (eles viram HTML e quebram o SSE)
ini_set('display_errors', '0');
error_reporting(0);

// Headers SSE ANTES de qualquer output
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('X-Accel-Buffering: no');
header('Access-Control-Allow-Origin: *');

// Força envio dos headers imediatamente
ob_start();
echo "data: " . json_encode(['type' => 'init', 'ts' => time()]) . "\n\n";
ob_end_flush();
flush();

ignore_user_abort(true);
set_time_limit(0);

$DATA_FILE = __DIR__ . '/users_online.json';
$lastMTime = file_exists($DATA_FILE) ? filemtime($DATA_FILE) : 0;
$heartbeatEvery = 20; // segundos
$lastBeat = time();

function sse_send(string $event, $data): void {
  echo "event: {$event}\n";
  echo 'data: ' . json_encode($data, JSON_UNESCAPED_UNICODE) . "\n\n";
  @ob_flush(); @flush();
}

while (!connection_aborted()) {
  clearstatcache(false, $DATA_FILE);
  $mtime = file_exists($DATA_FILE) ? filemtime($DATA_FILE) : 0;

  // Se o arquivo mudou, enviamos atualização
  if ($mtime !== $lastMTime) {
    $lastMTime = $mtime;
    $json = is_file($DATA_FILE) ? (file_get_contents($DATA_FILE) ?: '{}') : '{}';
    $payload = json_decode($json, true) ?? [];
    sse_send('users', ['ts' => time(), 'users' => $payload]);
  }

  // Heartbeat para manter conexão viva em proxies
  if (time() - $lastBeat >= $heartbeatEvery) {
    echo ": heartbeat\n\n";
    @ob_flush(); @flush();
    $lastBeat = time();
  }

  usleep(500000); // 0.5s
}
