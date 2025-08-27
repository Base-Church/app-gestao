<?php
// src/realtime/cleanup-offline.php
declare(strict_types=1);

$DATA_FILE = __DIR__ . '/users_online.json';
$hoursAgo = 24;
$cutoff = new DateTimeImmutable("-{$hoursAgo} hours");

$users = is_file($DATA_FILE) ? (json_decode(file_get_contents($DATA_FILE) ?: '{}', true) ?? []) : [];
$removed = 0;

foreach ($users as $sid => $u) {
  if (($u['status'] ?? '') === 'offline' && !empty($u['disconnectedAt'])) {
    $d = DateTimeImmutable::createFromFormat(DateTimeInterface::ATOM, $u['disconnectedAt']);
    if ($d && $d < $cutoff) {
      unset($users[$sid]); $removed++;
    }
  }
}

file_put_contents($DATA_FILE, json_encode($users, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
echo json_encode(['success'=>true,'removedCount'=>$removed, 'total'=>count($users)]);
