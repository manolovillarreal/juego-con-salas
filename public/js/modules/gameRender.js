let gameHtml = "";

gameHtml += '<h1 > Score: <span id="score" >0</span> </h1>';
gameHtml += '<div id="divPlayers"></div>';
gameHtml += '<canvas id="myCanvas" width="500" height="400"></canvas>    ';
gameHtml += '<div><input type="checkbox" id="checkPrediction" >';
gameHtml += '<label for="checkPrediction">Client Prediction</label>';
gameHtml += "<br>";
gameHtml += "</div>";
gameHtml += '<div><input type="checkbox" id="checkReconciliation" >';
gameHtml += '<label for="checkReconciliation">Server Reconciliation</label>';
gameHtml += "<br>";
gameHtml += "</div>";
gameHtml += '<div><input type="checkbox" id="checkInterpolation" >';
gameHtml += '<label for="checkInterpolation">Entity Interpolation</label>';
gameHtml += "<br>";
gameHtml += "</div>";
gameHtml += '<script type="module" src="./js/game.client.js"></script>';
//gameHtml += '<script type="module" src="/js/sockets.client.js"></script>';

export { gameHtml };
