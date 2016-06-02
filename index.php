<?php 

?>
<!DOCTYPE html>
<html>
<head>
	<title>Relatórios Analytics</title>
	<meta charset="utf-8" content="content">
	<link rel="stylesheet" type="text/css" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="style.css">
    <script src="bower_components/jquery/dist/jquery.min.js" type="text/javascript"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js" type="text/javascript"></script>

    <script>
        (function(w,d,s,g,js,fs){
            g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(f){this.q.push(f);}};
            js=d.createElement(s);fs=d.getElementsByTagName(s)[0];
            js.src='https://apis.google.com/js/platform.js';
            fs.parentNode.insertBefore(js,fs);js.onload=function(){g.load('analytics');};
        }(window,document,'script')); 
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.2/moment.min.js"></script>
    <script src="script/view-selector2.js"></script>
    <script src="script/date-range-selector.js"></script>
    <script src="script/active-users.js"></script>
    <script src="script.js" type="text/javascript"></script>
</head>
<body>
	<div class="overlay">
        <div class="loading-spinner"></div>
        <p class='texto'>Finer Front</p>
        <p class="percent"></p>
	</div>
    <div class="head">
        <h1>Relatório Front</h1>
    </div>
        <div id="maisAcessadoDia">
            <div class="col-md-4">
                <div class="panel panel-top1">
                    <h2>Mais acessado Hoje</h2>
                    <h4></h4>
                </div>
            </div>
        </div>
        <div id="acessosPontaGrossa">
            <div class="col-md-4">
                <div class="panel panel-top2">
                    <h2>Acessos Mobile</h2>
                    <h4></h4>
                </div>
            </div>
        </div>
        <div id="">
            <div class="col-md-4">
                <div class="panel panel-top3">
                    <h2>Alguma informação</h2>
                    <h4>Site - 99999</h4>
                </div>
            </div>
        </div>
        <div id="maisAcessado">
            <div class="col-md-8">
                <div class="panel">
                    <div class="col-md-12">
                        <h2>Mais Acessados: </h2>
                        <h4></h4>
                    </div>
                    <div class="box1">Total de acessos</div>
                    <div class="box2">Acessos Semanais</div>
                    <h5></h5>
                    <div id="graficoMaisAcessado"></div>
                    <div id="maisAcessadoLegenda"></div>
                    <div id="maisAcessadoInfo">
                        <div class="col-md-4 avgSession"></div>
                        <div class="col-md-4 pageView"></div>
                        <div class="col-md-4 users"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id="topSemanal">
            <div class="col-md-4">
                <div class="panel">
                    <h2>Semanal</h2>
                    <table class="table">
                    	<thead>
                    		<tr>
                                <th>Posição</th>
                    			<th>Site</th>
                    			<th></th>
                    			<th></th>
                    			<th>Acessos</th>
                                <th></th>
                    		</tr>
                    	</thead>
                    	<tbody>

                    	</tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel">
                <div id="cidades"></div>
                <div id="cidades-legenda"></div>  
            </div>
        </div>
        <div id="mobile"></div>
        <div id="tudo"></div>
        <div id="DIV_ID"></div>

    <div class="container">        
    	<div class="col-md-12">
        <div id="embed-api-auth-container"></div>
        <div id="view-selector-container"></div>
        <div id="active-users-container"></div>
        <div class="col-md-6">
            <div class="panel">
              <div id="chart-1-container"></div>
              <div id="legend-1-container"></div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel">
                <div id="chart-2-container"></div>
                <div id="legend-2-container"></div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel">
                <div id="chart-3-container"></div>
                <div id="legend-3-container"></div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="panel">
                <div id="chart-4-container"></div>
                <div id="legend-4-container"></div>
            </div>
        </div>
        </div>
    </div>
</body>
</html>