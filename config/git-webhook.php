<?php
// Caminho até o repositório clonado
$repoDir = '/home/tecn2702/domains/triks.digital/app';

// Comando para fazer git pull
$cmd = "cd {$repoDir} && git pull 2>&1";

// Executa e captura saída
$output = shell_exec($cmd);

// Exibe log
echo "<pre>$output</pre>";
?>
