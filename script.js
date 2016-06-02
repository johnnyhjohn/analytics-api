
gapi.analytics.ready(function() {

    /*
    * SCOPE     - Parâmentro que irá dizer quais as permissões que a aplicação vai ter
    * CLIENT_ID - ID do cliente para a aplicação
    * API       - Chave da API para a aplicação 
    */

    var  CLIENT_ID = '171063712480-tc1ibj4jk9gt5t3qgsudr9o69b4ank6d.apps.googleusercontent.com' // ALTERAR
    ,    SCOPE     = 'https://www.googleapis.com/auth/analytics.readonly'
    ,    API       = "AIzaSyB5ITcg3bPeRBXAhilrNEjfKCgwShLA4TI";  // ALTERAR


    //###### GLOBAL ######//
    var MAIS_ACESSADO          // Site com mais acessos 
    ,   MAIS_ACESSADO_SEMANAL  // Site com mais acessos na Semana
    ,   MAIS_ACESSADO_DIA      // Site que esta tendo mais acessos no dia
    //,   TOP_SEMANAIS    = [] // Array de 10 dos sites mais acessados na semana
    ,   RESULTADO_SEMANAL = [] // Array com todos os sites e seus acessos semanais
    ,   acessos           = [] 
    ,   acessosSemanais   = []
    ,   RESULTADO_DIARIO  = []
    ,   DADOS_OLD         = {}
    ,   ACESSO_CIDADE     = 0
    ,   acessosDiarios    = [];


    // Seta a key da API Google
    gapi.client.setApiKey(API);

    /*
    * Método de autorização da conta para o analytics
    *
    * O Google Analytics precisa que você permita ele pegar dados de sua conta
    * Então esta método é para dar este acesso a ele
    *
    * Passando o SCOPE, o CLIENT_ID e um ID de elemento para dar append no botão 
    */
    gapi.analytics.auth.authorize({
      container: 'embed-api-auth-container',
      clientid: CLIENT_ID,
      scope   : SCOPE
    });
  gapi.analytics.auth.on('success', function(response) {
    listAccounts();    
        setInterval(function(){
            listAccounts();
        }, 600000)
  });

    function listAccounts() {
        var request = gapi.client.analytics.management.accountSummaries.list();
        request.execute(getAccounts);
    }

/*
*   @desc
*   Método que monta o array dos mais acessados, 
*   ordenando os mais acessados
*/
var loopMaisAcessado = function(){
    var n = Number.MIN_VALUE;

    for (var i = 0; i < acessos.length; i++){
        if (acessos[i].acessos > n){
            n = acessos[i].acessos;
            MAIS_ACESSADO = acessos[i];
        }
    }
}

var loopMaisAcessadoDiario = function(){
    var n = Number.MIN_VALUE;

    for (var i = 0; i < acessosDiarios.length; i++){
        if (acessosDiarios[i].acessos > n){
            n = acessosDiarios[i].acessos;
            MAIS_ACESSADO_DIA = acessosDiarios[i];
        }
    }   
}

var loopMaisAcessadoSemanal = function(){
    var n = Number.MIN_VALUE;

    for (var i = 0; i < acessosSemanais.length; i++){
        if (acessosSemanais[i].acessos > n){
            n = acessosSemanais[i].acessos;
            MAIS_ACESSADO_SEMANAL = acessosSemanais[i];
        }
    }   
}

var getResultadoSemanal = function(TOP_SEMANAIS){
    for (var i = RESULTADO_SEMANAL.length - 1; i >= (RESULTADO_SEMANAL.length - 10); i--) {
        for (var j = 0; j < acessosSemanais.length; j++) {
            var acesso = "" + acessosSemanais[j].acessos;
            if (acesso == RESULTADO_SEMANAL[i] && RESULTADO_SEMANAL[i] != RESULTADO_SEMANAL[i - 1]) {
                TOP_SEMANAIS.push(acessosSemanais[j]);
            };
        };
    };  
}

function getAccounts(results) {
  if (results && !results.error) {
    var items        = []
    ,   TOP_SEMANAIS = [];

    $.each(results.items, function(key, value) {
        $.each(value.webProperties, function(index, val) {
             items.push(val);
        });
    });
    $.each(items, function(index, val) {
        getMaisAcessado(val.profiles[0].id, index, val.name, val.websiteUrl);       // Request do Mais Acessado desde o Início
        getTopSemanal(val.profiles[0].id, index, val.name, val.websiteUrl);         // Request dos 10 mais Acessados da semana
        getMaisAcessadoDia(val.profiles[0].id, index, val.name, val.websiteUrl);    // Request do mais acessado do dia
        //getAcessoMobile(val.profiles[0].id, index, val.name, val.websiteUrl);
        renderTopCountriesChart(('ga:' + val.profiles[0].id), index, val.name, val.websiteUrl);
    });    

    setTimeout(function(){

        // ALIMENTA AS GLOBAIS
        loopMaisAcessado();         // MAIS_ACESSADO
        loopMaisAcessadoDiario();   // MAIS_ACESSADO_DIARIO
        loopMaisAcessadoSemanal();  // MAIS_ACESSADO_SEMANAL

        // Organiza os dados da Matriz RESULTADO_SEMANAL
        RESULTADO_SEMANAL.sort(compararNumeros);
        getResultadoSemanal(TOP_SEMANAIS);
        // Monta no DOM a visualização dos dados
        montaMaisVisualizado();
        montaTop10Semanal(TOP_SEMANAIS);
        montaAcessoDiario();
        $("#acessosPontaGrossa h4").html(ACESSO_CIDADE + " acessos");
        console.log(acessos);

        $(".overlay").addClass('fadeOut');  
    }, 140000);
    setTimeout(function(){
        setDadosOld(TOP_SEMANAIS);
        limpaGlobais(); // Limpa as Globais para o Interval refazer elas com os novos dados
    },144000);      
  }
}

function montaMaisVisualizado(){
    $("#maisAcessado h4").html(MAIS_ACESSADO_SEMANAL.site);
    $("#maisAcessado .box1").html("<p>Total: "+ MAIS_ACESSADO_SEMANAL.acessos +" acessos</p>");
    montaGraficoMaisVisualizado(MAIS_ACESSADO_SEMANAL.profileId);    
}

function montaTopSemanal(){
    $("#maisAcessadoSemana h4").html(MAIS_ACESSADO_SEMANAL.site + " - " + MAIS_ACESSADO_SEMANAL.acessos + " acessos");
}
function montaAcessoDiario(){
    console.log(MAIS_ACESSADO_DIA);
    $("#maisAcessadoDia h4").html(MAIS_ACESSADO_DIA.site + " - " + MAIS_ACESSADO_DIA.acessos + " acessos");

}

function montaTop10Semanal(TOP_SEMANAIS){
    $("#topSemanal .panel tbody").html("");
    $.each(TOP_SEMANAIS, function(index, val) {
        $("#topSemanal .panel tbody").append("\
            <tr id='"+ val.profileId +"' data-site='"+ val.site +"' data-posicao='"+ (index + 1) +"'>\
                <th class='text-center'>"+ (index + 1) + "</th>\
                <th>"+ val.site +"</th>\
                <th></th><th></th>\
                <th class='text-center'>"+ val.acessos +"<span class='arrow arrow-"+ val.profileId +"'></span></th>\
            <tr>");

        mudancaPosicaoTabela(val, index);
    });
}

function getMaisAcessado(profile_id, key, nome, url) {
    try{
        var now = moment();
        var params =  {
            'ids'       : 'ga:' + profile_id,
            'dimensions': 'ga:date,ga:nthDay,ga:deviceCategory',
            'metrics'   : 'ga:sessions,ga:pageviews',
            'start-date': '2007-01-01',
            'end-date'  : moment(now).format('YYYY-MM-DD'),
            'sort'      : 'ga:pageviews',
            'max-results': 10000
        }

        var tempo = parseInt((key + 1)+"000") / 1.5;
        var report = gapi.client.analytics.data.ga.get(params);

        //$("#tudo").append("<div data-site='"+ nome +"' id='"+ profile_id +"' class='col-md-3'><div class='panel'><h4>"+ nome +"</h4></div></div>");

        setTimeout(function(){
            console.log(tempo);
            report.execute(handleCoreReportingResults);
        }, tempo);

    }catch(e){
        if(e){
          getMaisAcessado(profile_id, key, nome, url);
        }
    }
}

function getAcessoMobile(profile_id, key, nome, url){
    try{
        var tempo = parseInt((key + 1)+"000") / 1;
        setTimeout(function(){
            var now = moment();
            query({
                'ids': ids,      
                'dimensions': 'ga:deviceCategory',
                'metrics': 'ga:sessions',
                'start-date': '2007-01-01',
                'end-date'  : moment(now).format('YYYY-MM-DD'),    
                'sort': '-ga:sessions',
                'filters': 'ga:deviceCategory==mobile',
                'max-results': 10000
            })
            .then(function(response) {
              var data = [];
              var colors = ['#4D5360','#949FB1','#D4CCC5','#E2EAE9','#F7464A'];
            
              // response.rows.forEach(function(row, i) {
              //   data.push({
              //     label: row[0],
              //     value: +row[1],
              //     color: colors[i]
              //   });
              // });
              if(response.rows != undefined){
                    response.rows.forEach(function(row, i) {
                        ACESSO_CIDADE = parseInt(ACESSO_CIDADE) + parseInt(row[1]);
                    });              
                    $("#acessosPontaGrossa h4").html(ACESSO_CIDADE + " acessos");
              }
        
            });
        }, tempo);    
        setTimeout(function(){
            query({
              'ids'       : 'ga:' + profile_id,
              'dimensions': 'ga:deviceCategory',
              'metrics'   : 'ga:sessions',
              'sort'      : '-ga:sessions'
            })
            .then(function(response) {

              var data = [];
              var colors = ['#4D5360','#949FB1','#D4CCC5','#E2EAE9','#F7464A'];

              response.rows.forEach(function(row, i) {
                data.push({ value: +row[1], color: colors[i], label: row[0] });
              });

              new Chart(makeCanvas('mobile')).Doughnut(data);
              generateLegend('legend-3-container', data);
            });
         }, tempo);
    }catch(e){
        if(e){
          getMaisAcessado(profile_id, key, nome, url);
        }
    }    
}

function getMaisAcessadoDia(profile_id, key, nome, url) {
    try{
        var now     = moment();
        var params  =  {
            'ids'       : 'ga:' + profile_id,
            'dimensions': 'ga:date,ga:nthDay',
            'metrics'   : 'ga:sessions,ga:pageviews',
            'start-date': moment(now).format('YYYY-MM-DD'),
            'end-date'  : moment(now).format('YYYY-MM-DD'),
            'sort'      : 'ga:pageviews',
            'max-results': 10000
        }

        var tempo  = parseInt((key + 1)+"000") / 1.5;
        var report = gapi.client.analytics.data.ga.get(params);

        //$("#tudo").append("<div data-site='"+ nome +"' id='"+ profile_id +"' class='col-md-3'><div class='panel'><h4>"+ nome +"</h4></div></div>");

        setTimeout(function(){
            console.log(tempo);
            report.execute(handleCoreReportingResultsDiario);
        }, tempo);
    }catch(e){
        console.log(e); 
    }
}
function getTopSemanal(profile_id, key, nome, url) {
    try{
        var now = moment();
        var tempo = parseInt((key + 1)+"000") / 1.5;
        
        var params =  {
            'ids'       : 'ga:' + profile_id,
            'dimensions': 'ga:date,ga:nthDay',
            'metrics'   : 'ga:sessions,ga:pageviews',
            'start-date': moment(now).subtract(1, 'day').day(0).format('YYYY-MM-DD'),
            'end-date'  : moment(now).format('YYYY-MM-DD'),
            'sort'      : 'ga:pageviews'
        }

        var report = gapi.client.analytics.data.ga.get(params);
        
        $("#tudo").append("<div data-site='"+ nome +"' id='"+ profile_id +"' class='col-md-6'><div class='panel'><h4>"+ nome +"</h4></div></div>");

        setTimeout(function(){
            console.log(tempo);
            report.execute(handleCoreReportingResultsSemanal);
        }, tempo);
    }catch(e){
        console.log(e); 
    }
}
function compararNumeros(a, b) {
  return a - b;
}

function handleCoreReportingResults(results) {
    if (!results.error) {
        var site = $("#"+results.profileInfo.profileId).data('site');

        acessos.push({
            acessos     : parseInt(results.totalsForAllResults['ga:sessions']),
            site        : site,
            profileId   : results.profileInfo.profileId,
            dispositivos: parseInt(results.totalsForAllResults['ga:deviceCategory'])
        });
        //$("#"+results.profileInfo.profileId + " .panel").append("<p>Views:"+ results.totalsForAllResults['ga:sessions'] +"</p>")

    } else {
        console.log('There was an error: ' + results.message);
    }
}

function handleCoreReportingResultsMobile(results) {
    if (!results.error) {
        var site = $("#"+results.profileInfo.profileId).data('site');

        // acessos.push({
        //     acessos     : parseInt(results.totalsForAllResults['ga:sessions']),
        //     site        : site,
        //     profileId   : results.profileInfo.profileId,
        //     dispositivos: parseInt(results.totalsForAllResults['ga:deviceCategory'])
        // });
        console.log(results)

        //$("#"+results.profileInfo.profileId + " .panel").append("<p>Views:"+ results.totalsForAllResults['ga:sessions'] +"</p>")

    } else {
        console.log('There was an error: ' + results.message);
    }
}

function handleCoreReportingResultsDiario(results) {
    if (!results.error) {
        var site = $("#"+results.profileInfo.profileId).data('site');

        RESULTADO_DIARIO.push(results.totalsForAllResults['ga:sessions']);
        acessosDiarios.push({
            acessos     : parseInt(results.totalsForAllResults['ga:sessions']),
            site        : site,
            profileId   : results.profileInfo.profileId
        });        

    } else {
        console.log('There was an error: ' + results.message);
    }
}


function handleCoreReportingResultsSemanal(results) {
    if (!results.error) {
        //console.log(results);
        var site = $("#"+results.profileInfo.profileId).data('site');
        RESULTADO_SEMANAL.push(results.totalsForAllResults['ga:sessions']);

        acessosSemanais.push({
            acessos     : parseInt(results.totalsForAllResults['ga:sessions']),
            site        : site,
            profileId   : results.profileInfo.profileId
        });
        //$("#"+results.profileInfo.profileId + " .panel").append("<p>Views Semanais:"+ results.totalsForAllResults['ga:sessions'] +"</p>")


    } else {
        console.log('There was an error: ' + results.message);
    }
}

function montaGraficoMaisVisualizado(ids){


    // Adjust `now` to experiment with different days, for testing only...
    var now = moment(); // .subtract(3, 'day');

    var thisWeek = query({
        'ids'       : 'ga:' + ids,
        'dimensions': 'ga:date,ga:nthDay',
        'metrics'   : 'ga:sessions,ga:pageviews,ga:sessionDuration,ga:avgSessionDuration,ga:users',
        'start-date': moment(now).subtract(1, 'day').day(0).format('YYYY-MM-DD'),
        'end-date'  : moment(now).format('YYYY-MM-DD')
    });

    var lastWeek = query({
        'ids'       : 'ga:' + ids,
        'dimensions': 'ga:date,ga:nthDay',
        'metrics'   : 'ga:sessions',
        'start-date': moment(now).subtract(1, 'day').day(0).subtract(1, 'week').format('YYYY-MM-DD'),
        'end-date'  : moment(now).subtract(1, 'day').day(6).subtract(1, 'week').format('YYYY-MM-DD')
    });
    Promise.all([thisWeek, lastWeek]).then(resultsPromise);
}

function resultsPromise(results){
    var data1   = results[0].rows.map(function(row) { return +row[2]; })
    ,   data2   = results[1].rows.map(function(row) { return +row[2]; })
    ,   labels  = results[1].rows.map(function(row) { return +row[0]; })
    ,   avgSessionDuration = (results[0].totalsForAllResults['ga:avgSessionDuration'] / 60).toFixed(2)
    ,   pageViews = results[0].totalsForAllResults['ga:pageviews']
    ,   users     = results[0].totalsForAllResults['ga:users'];

    console.log(results, avgSessionDuration, pageViews);
    labels = labels.map(function(label) {
        return moment(label, 'YYYYMMDD').format('ddd');
    });

    var data = {
        labels : labels,
        datasets : [
          {
            label       : 'Ultima Semana',
            fillColor   : 'rgba(220,220,220,0.0)',
            strokeColor : 'rgba(220,220,220,1)',
            pointColor  : 'rgba(220,220,220,1)',
            pointStrokeColor : '#fff',
            data : data2
          },
          {
            label       : 'Semana Atual',
            fillColor   : 'rgba(245,130,32,0.0)',
            strokeColor : 'rgba(245,130,32,1)',
            pointColor  : 'rgba(245,130,32,1)',
            pointStrokeColor : '#fff',
            data : data1
          }
        ]
    };

    $("#graficoMaisAcessado").addClass('criado');
    chart = new Chart(makeCanvas('graficoMaisAcessado')).Line(data);
    generateLegend('maisAcessadoLegenda', data.datasets);
    $("#maisAcessado .box2").html("<p>Diário: "+ data1[data1.length - 1] +" acessos</p>");    
    $("#maisAcessadoInfo .avgSession").html("<p>Avg. de Sessão: "+ avgSessionDuration +" seg</p>");    
    $("#maisAcessadoInfo .pageView").html("<p>Views de Páginas: "+ pageViews +"</p>");
    $("#maisAcessadoInfo .users").html("<p>Usuários: "+ users +"</p>");
    
}
/**
  //  * Create a new ActiveUsers instance to be rendered inside of an
  //  * element with the id "active-users-container" and poll for changes every
  //  * five seconds.
  //  */
  //  var activeUsers = new gapi.analytics.ext.ActiveUsers({
  //    container: 'active-users-container',
  //    pollingInterval: 5
  //  });


  // /**
  //  * Add CSS animation to visually show the when users come and go.
  //  */
  // activeUsers.once('success', function() {
  //   var element = this.container.firstChild;
  //   var timeout;
  //   this.on('change', function(data) {
  //     var element = this.container.firstChild;
  //     var animationClass = data.delta > 0 ? 'is-increasing' : 'is-decreasing';
  //     element.className += (' ' + animationClass);

  //     clearTimeout(timeout);
  //     timeout = setTimeout(function() {
  //       element.className =
  //           element.className.replace(/ is-(increasing|decreasing)/g, '');
  //     }, 3000);
  //   });
  // });


  /**
   * Create a new ViewSelector2 instance to be rendered inside of an
   * element with the id "view-selector-container".
  //  */
  // var viewSelector = new gapi.analytics.ext.ViewSelector2({
  //   container: 'view-selector-container',
  // })
  // .execute();


  /**
   * Update the activeUsers component, the Chartjs charts, and the dashboard
   * title whenever the user changes the view.
   */
  // viewSelector.on('viewChange', function(data) {
  //   // var title = document.getElementById('view-name');
  //   // title.innerHTML = data.property.name + ' (' + data.view.name + ')';

  //   // Start tracking active users for this view.
  //   activeUsers.set(data).execute();
  //   // console.log(data);

  //   // Render all the of charts for this view.
  //   renderWeekOverWeekChart(data.ids);
  //   renderYearOverYearChart(data.ids);
  //   renderTopBrowsersChart(data.ids);
  //   renderTopCountriesChart(data.ids);
  // });


  /**
   * Draw the a chart.js line chart with data from the specified view that
   * overlays session data for the current week over session data for the
   * previous week.
   */
  function renderWeekOverWeekChart(ids) {

    // Adjust `now` to experiment with different days, for testing only...
    var now = moment(); // .subtract(3, 'day');

    var thisWeek = query({
      'ids': ids,
      'dimensions': 'ga:date,ga:nthDay',
      'metrics': 'ga:sessions',
      'start-date': moment(now).subtract(1, 'day').day(0).format('YYYY-MM-DD'),
      'end-date': moment(now).format('YYYY-MM-DD')
    });

    var lastWeek = query({
      'ids': ids,
      'dimensions': 'ga:date,ga:nthDay',
      'metrics': 'ga:sessions',
      'start-date': moment(now).subtract(1, 'day').day(0).subtract(1, 'week')
          .format('YYYY-MM-DD'),
      'end-date': moment(now).subtract(1, 'day').day(6).subtract(1, 'week')
          .format('YYYY-MM-DD')
    });

    Promise.all([thisWeek, lastWeek]).then(function(results) {

      var data1 = results[0].rows.map(function(row) { return +row[2]; });
      var data2 = results[1].rows.map(function(row) { return +row[2]; });
      var labels = results[1].rows.map(function(row) { return +row[0]; });

      labels = labels.map(function(label) {
        return moment(label, 'YYYYMMDD').format('ddd');
      });

      var data = {
        labels : labels,
        datasets : [
          {
            label: 'Last Week',
            fillColor : 'rgba(220,220,220,0.5)',
            strokeColor : 'rgba(220,220,220,1)',
            pointColor : 'rgba(220,220,220,1)',
            pointStrokeColor : '#fff',
            data : data2
          },
          {
            label: 'This Week',
            fillColor : 'rgba(151,187,205,0.5)',
            strokeColor : 'rgba(151,187,205,1)',
            pointColor : 'rgba(151,187,205,1)',
            pointStrokeColor : '#fff',
            data : data1
          }
        ]
      };

      new Chart(makeCanvas('chart-1-container')).Line(data);
      generateLegend('legend-1-container', data.datasets);
    });
  }


  /**
   * Draw the a chart.js bar chart with data from the specified view that
   * overlays session data for the current year over session data for the
   * previous year, grouped by month.
   */
  function renderYearOverYearChart(ids) {

    // Adjust `now` to experiment with different days, for testing only...
    var now = moment(); // .subtract(3, 'day');

    var thisYear = query({
      'ids': ids,
      'dimensions': 'ga:month,ga:nthMonth',
      'metrics': 'ga:users',
      'start-date': moment(now).date(1).month(0).format('YYYY-MM-DD'),
      'end-date': moment(now).format('YYYY-MM-DD')
    });

    var lastYear = query({
      'ids': ids,
      'dimensions': 'ga:month,ga:nthMonth',
      'metrics': 'ga:users',
      'start-date': moment(now).subtract(1, 'year').date(1).month(0)
          .format('YYYY-MM-DD'),
      'end-date': moment(now).date(1).month(0).subtract(1, 'day')
          .format('YYYY-MM-DD')
    });

    Promise.all([thisYear, lastYear]).then(function(results) {
      var data1 = results[0].rows.map(function(row) { return +row[2]; });
      var data2 = results[1].rows.map(function(row) { return +row[2]; });
      var labels = ['Jan','Feb','Mar','Apr','May','Jun',
                    'Jul','Aug','Sep','Oct','Nov','Dec'];

      // Ensure the data arrays are at least as long as the labels array.
      // Chart.js bar charts don't (yet) accept sparse datasets.
      for (var i = 0, len = labels.length; i < len; i++) {
        if (data1[i] === undefined) data1[i] = null;
        if (data2[i] === undefined) data2[i] = null;
      }

      var data = {
        labels : labels,
        datasets : [
          {
            label: 'Last Year',
            fillColor : 'rgba(220,220,220,0.5)',
            strokeColor : 'rgba(220,220,220,1)',
            data : data2
          },
          {
            label: 'This Year',
            fillColor : 'rgba(151,187,205,0.5)',
            strokeColor : 'rgba(151,187,205,1)',
            data : data1
          }
        ]
      };

      new Chart(makeCanvas('chart-2-container')).Bar(data);
      generateLegend('legend-2-container', data.datasets);
    })
    .catch(function(err) {
      console.error(err.stack);
    });
  }


  /**
   * Draw the a chart.js doughnut chart with data from the specified view that
   * show the top 5 browsers over the past seven days.
   */
  function renderTopBrowsersChart(ids) {

    query({
      'ids'       : ids,
      'dimensions': 'ga:browser',
      'metrics'   : 'ga:pageviews',
      'sort'      : '-ga:pageviews',
      'max-results': 5
    })
    .then(function(response) {

      var data = [];
      var colors = ['#4D5360','#949FB1','#D4CCC5','#E2EAE9','#F7464A'];

      response.rows.forEach(function(row, i) {
        data.push({ value: +row[1], color: colors[i], label: row[0] });
      });

      new Chart(makeCanvas('chart-3-container')).Doughnut(data);
      generateLegend('legend-3-container', data);
    });
  }


  /**
   * Draw the a chart.js doughnut chart with data from the specified view that
   * compares sessions from mobile, desktop, and tablet over the past seven
   * days.
   */
  function renderTopCountriesChart(ids, key, nome, url) {

    var tempo = parseInt((key + 1)+"000") / 1;
    setTimeout(function(){
        var now = moment();
        query({
            'ids': ids,      
            'dimensions': 'ga:deviceCategory',
            'metrics': 'ga:sessions',
            'start-date': '2007-01-01',
            'end-date'  : moment(now).format('YYYY-MM-DD'),    
            'sort': '-ga:sessions',
            'filters': 'ga:deviceCategory==mobile',
            'max-results': 10000
        })
        .then(function(response) {
          var data = [];
        
          // response.rows.forEach(function(row, i) {
          //   data.push({
          //     label: row[0],
          //     value: +row[1],
          //     color: colors[i]
          //   });
          // });
          if(response.rows != undefined){
                response.rows.forEach(function(row, i) {
                    ACESSO_CIDADE = parseInt(ACESSO_CIDADE) + parseInt(row[1]);
                });              
          }
    
        });
    }, tempo);    
  }


  /**
   * Extend the Embed APIs `gapi.analytics.report.Data` component to
   * return a promise the is fulfilled with the value returned by the API.
   * @param {Object} params The request parameters.
   * @return {Promise} A promise.
   */
  function query(params) {
    return new Promise(function(resolve, reject) {
        var data = new gapi.analytics.report.Data({query: params});
        data.once('success', function(response) { resolve(response);})
            .once('error', function(response) { reject(response); })
            .execute();
    });
  }


  /**
   * Create a new canvas inside the specified element. Set it to be the width
   * and height of its container.
   * @param {string} id The id attribute of the element to host the canvas.
   * @return {RenderingContext} The 2D canvas context.
   */
  function makeCanvas(id) {
    var container = document.getElementById(id);
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    container.innerHTML = '';
    canvas.width = 500;
    canvas.height = 300;
    container.appendChild(canvas);

    return ctx;
  }

  function setDadosOld(OLD_TOP_SEMANAIS){
    return DADOS_OLD = {
            TOP_SEMANAIS : OLD_TOP_SEMANAIS
        }    
  }

  /*
  *     @desc
  *     Monta setas para a tabela semanal, se o site subiu ou desceu na tabela.
  */
  function mudancaPosicaoTabela(val, index){
    if(DADOS_OLD.TOP_SEMANAIS !== undefined){
        $.each(DADOS_OLD.TOP_SEMANAIS, function(i, old_value) {
            if(($("#" + val.profileId).data('site') == old_value.site) && ((index + 1) < (i + 1))){
                $(".arrow-" + val.profileId + " .index").remove();
                $(".arrow-" + val.profileId).css({
                    "background-position": "0 -12px",
                    "height"             : "8px"
                });
                $(".arrow-" + val.profileId).after("<span class='index'>" + (Number(i + 1) - Number(index + 1)) + "</span>");
                console.log((Number(i + 1) - Number(index + 1)), $("#" + val.profileId).data('site'), index, i, 'desce');
            }else if(($("#" + val.profileId).data('site') == old_value.site) && ((index + 1) == (i + 1))){
                $(".arrow-" + val.profileId + " .index").remove();
                $(".arrow-" + val.profileId).css({
                    "background-position" : "0 -8px",
                    "height"              : "4px",
                    "vertical-align"      : "middle"
                });
            }else if(($("#" + val.profileId).data('site') == old_value.site) && ((index + 1) > (i + 1))){
                $(".arrow-" + val.profileId + " .index").remove();
                $(".arrow-" + val.profileId).css({
                    "background-position": "0 0px",
                    "height"             : "8px"
                });
                $(".arrow-" + val.profileId).after("<span class='index'>"+ (Number(index + 1) - Number(i + 1)) +"</span>");
                console.log((Number(index + 1) - Number(i + 1)), $("#" + val.profileId).data('site'), index, i, 'sobe');
            }
        });
    }
  }

  /*
  *  Método para limpar as globais, para quando o Interval acontecer
  *  ele montar elas com os dados recentes
  */
  function limpaGlobais(){

        MAIS_ACESSADO = {}  ;
        MAIS_ACESSADO_SEMANAL = {};
        TOP_SEMANAIS        = [];
        RESULTADO_SEMANAL   = [];
        acessos             = [];
        acessosSemanais     = [];
        RESULTADO_DIARIO    = [];
        acessosDiarios      = [];
        ACESSO_CIDADE       = 0;
        MAIS_ACESSADO_DIA   = {};
  }

  /**
   * Create a visual legend inside the specified element based off of a
   * Chart.js dataset.
   * @param {string} id The id attribute of the element to host the legend.
   * @param {Array.<Object>} items A list of labels and colors for the legend.
   */
  function generateLegend(id, items) {
    var legend = document.getElementById(id);
    legend.innerHTML = items.map(function(item) {
      var color = item.color || item.strokeColor;
      var label = item.label;
      return '<li><i style="background:' + color + '"></i>' + label + '</li>';
    }).join('');
  }


  // Set some global Chart.js defaults.
  Chart.defaults.global.animationSteps = 60;
  Chart.defaults.global.animationEasing = 'easeInOutQuart';
  Chart.defaults.global.responsive = true;
  Chart.defaults.global.maintainAspectRatio = false;


});

