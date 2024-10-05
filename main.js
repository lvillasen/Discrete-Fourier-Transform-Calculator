  var T = document.getElementById("time").value;
  var sampling_rate = document.getElementById("sampling").value;
  var N = parseInt(T * sampling_rate);
  var title ;
  var titleDFT;
  var ts ;
  var xs;
  var xs_window ;
  var frec ;
  var totalTime;
  var titleDFTk ="";
  var XaxisDFTk ;
  var last = "Function";

var samplingIntervalData;
var samplingIntervalUnit;
var plotOut = document.getElementById("plot_dataXY");
var toggle_YvsX = document.getElementById('toggleXY');
toggle_YvsX.addEventListener('click', plotXY_out);
document.getElementById("plot_dataXY").style.display = "none";
var toggle_DFTData = document.getElementById('toggleDFTData');
toggle_DFTData.addEventListener('click', DFTData_out);
document.getElementById("textAreaDFT").style.display = "none";


  var f_Nyquist = sampling_rate / 2;
  var my_X_real ;
  var my_X_imag ;
  var my_X_abs ;
var columnX;
var columnY;
  var data_tot = [];
var data_tot2 = [];
  
window.onresize = function(){ location.reload(); }


  //Plot();











function prepareFunction(){
  title = "Samples in Time Domain";
samplingIntervalUnit ="s";
titleDFTk = "Time (s)";
var fun = document.getElementById("func");
      var f1_fun = document.getElementById("f1");
      var f2_fun = document.getElementById("f2");
      T = document.getElementById("time").value;
	totalTime = T;
      sampling_rate = document.getElementById("sampling").value;



      f_Nyquist = sampling_rate / 2;
      N = parseInt(T * sampling_rate);
      if ((Math.log(N) / Math.log(2)) % 1 != 0) {
          alert("The number of samples is the product of T and Sampling Rate, in this case it is: " + N.toString() + "\n\nPlease change T and/or Sampling Rate so that their multiplication is a power of 2");
      }

  

      ts = new Array(N).fill(0);
      xs = new Array(N).fill(0);
      xs_window = new Array(N).fill(0);
      frec = new Array(N).fill(0);

      for (var n = 0; n < N; n += 1) {
          ts[n] = n / N * T;
          frec[n] = n ;
      }
      var window = document.getElementById("window").value;
      for (var n = 0; n < N; n += 1) {
          var t = n / N * T;

          with(Math) {
              var f1 = eval(f1_fun.value);
              var f2 = eval(f2_fun.value);
              xs[n] = eval(fun.value);
              if (window == "Cosine") {
                  xs_window[n] = Math.sin(Math.PI * n / N) * eval(fun.value);
              } else if (window == "Hanning") {
                  xs_window[n] = 0.5 * (1 - Math.cos(2 * Math.PI * n / (N - 1))) * eval(fun.value);
              } else if (window == "Hamming") {
                  xs_window[n] = (0.53836 - .46164 * Math.cos(2 * Math.PI * n / (N - 1))) * eval(fun.value);
              } else if (window == "Blackman") {
                  xs_window[n] = (0.42 - .5 * Math.cos(2 * Math.PI * n / (N - 1)) + .08 * Math.cos(4 * Math.PI * n / (N - 1))) * eval(fun.value);

              } else if (window == "None") {
                  xs_window[n] = eval(fun.value);
              }
          }
      }
      
      last = "Function";
      Plot();
      DisplayDFT();
    }





  function Plot() {


      var my_x = [...xs_window];
      my_X_abs = new Array(my_x.length ).fill(0);

if (Math.log2(my_x.length) == parseInt(Math.log2(my_x.length))) {

      fft = FFT(my_x);
      my_X_real = new Array(my_x.length ).fill(0);
      my_X_imag = new Array(my_x.length ).fill(0);
      for (var i = 0; i < N ; i += 1) {
          my_X_real[i] = fft[i].re;
          my_X_imag[i] = fft[i].im;
      }
  } else {
    //console.log("my_x = "+ my_x);
    //console.log("my_x.length = "+ my_x.length);
[my_X_real,my_X_imag] =  dft(my_x,new Array(my_x.length).fill(0));
  }

  for (var i = 0; i < N ; i += 1) {
    try{
          if (document.getElementById("logscale").checked) {
            titleDFT_abs = "Log(Abs Value)";
             my_X_abs[i] = Math.log10(Math.sqrt(my_X_real[i] * my_X_real[i] + my_X_imag[i] * my_X_imag[i]));
         } else {
              titleDFT_abs = "Abs Value";
              my_X_abs[i] = Math.sqrt(my_X_real[i] * my_X_real[i] + my_X_imag[i] * my_X_imag[i]);
         }
      } catch (error) { console.log("i="+i);}
          
      }


if (last == "Function"){
      var layout1 = {
          xaxis: {
              //   range: [0, N],
              title: "Time (s)"
          },
          yaxis: {
              //    range: [-1, 1],
              title: "x(t)"
          },
          title: "Samples in Time Domain"
      };
} else {
  var layout1 = {
          xaxis: {
              //   range: [0, N],
              title: "Time "+ "("+samplingIntervalUnit+")"
          },
          yaxis: {
              //    range: [-1, 1],
              title: "x(t)"
          },
          title: title
      };
}
if (document.getElementById('epoch').checked) {
      ts_new  = ts.map(convertirAFecha) ;
	XaxisDFTk = ts_new;
      var data1 = [{
          x: ts_new,
          y: xs_window,
          mode: "lines+markers"
      }];
}else{
	XaxisDFTk = ts;
 var data1 = [{
          x: ts,
          y: xs_window,
          mode: "lines+markers"
      }]; 
}


      var trace1 = {
          x: frec,
          y: my_X_real,
          mode: 'lines+markers',
          marker: {
              color: 'green',
              size: 4,
              line: {
                  color: 'green',
                  width: 1
              },
              type: 'scatter',
              name: 'Real'
          }
      }
      var trace2 = {
          x: frec,
          y: my_X_imag,
          mode: 'lines+markers',
          marker: {
              color: 'red',
              size: 4,
              line: {
                  color: 'red',
                  width: 1
              },
              type: 'scatter',
              name: 'Imag'
          }
      }
      var trace3 = {
          x: frec,
          y: my_X_abs,
          mode: 'lines+markers',
          marker: {
              color: 'blue',
              size: 4,
              line: {
                  color: 'blue',
                  width: 1
              },
              type: 'scatter',
              name: 'Abs'
          }
      }

      if (document.getElementById('check1').checked) {
          data2  = [trace1];
         titleDFT = "Real Part";

      } else if (document.getElementById('check2').checked) {
          titleDFT = "Imaginary Part";
          data2 = [trace2];
      } else if (document.getElementById('check3').checked) {
          titleDFT = titleDFT_abs;
          data2 = [trace3];
      }
if (last == "Function"){

      var layout2 = {
          xaxis: {
              //   range: [0, N],
              title: "Index of DFT"
          },
          yaxis: {
              //    range: [-1, 1],
              title: titleDFT
          },
          title: "Discrete Fourier Transform"
      };
} else {
  var layout2 = {
          xaxis: {
              //   range: [0, N],
              title: "Index of DFT"
          },
          yaxis: {
              //    range: [-1, 1],
              title: titleDFT
          },
          title: "Discrete Fourier Transform"
      };
}

      Plotly.newPlot("plot1", data1, layout1);
      Plotly.newPlot("plot2", data2, layout2);
    

  }



  function onlyOne(checkbox) {
    if (document.getElementById("check1").checked) {
    document.getElementById("logscale").checked = false;
  }
  if (document.getElementById("check2").checked) {
    document.getElementById("logscale").checked = false;
  }
      var checkboxes = document.getElementsByName('check');
      checkboxes.forEach((item) => {
          if (item !== checkbox) item.checked = false
      })
      if (last =="Function"){
        prepareFunction();
      } else {
        prepareData();
      }

  }

  
  function prepareData() {
    var myText = document.getElementById("textArea").value;
    title = document.getElementById("title").value;

    var data = [];
    const separator = (document.getElementById("separator").value);
    samplingIntervalData = parseFloat(document.getElementById("samplingIntervalData").value);

    samplingIntervalUnit = document.getElementById("samplingIntervalUnit").value;
    titleDFTk = "Time ("+samplingIntervalUnit+")";

    columnX = parseInt(String(document.getElementById("columnX").value));
    columnY = parseInt(String(document.getElementById("columnY").value));


    var myArray = myText.split("\n");
    N = myArray.length; 
    totalTime = N;
    ts = new Array(N).fill(0);
    xs = new Array(N).fill(0);
    xs_window = new Array(N).fill(0);

    frec = new Array(N).fill(0);
    for (var i = 0; i < myArray.length ; i += 1) {
      if (Array.from(separator)[0] == " "){
      //var myRow = myArray[i].split(separator);
	var  myRow = filterWords(myArray[i]);
      } else{
        var myRow = myArray[i].split(separator);
      }

      //ts[i] = i;
      ts[i] = parseFloat(myRow[columnX]);
      
      xs[i] = parseFloat(myRow[columnY]);
      frec[i] = i ;

    }
    var window = document.getElementById("window").value;
      for (var n = 0; n < N; n += 1) {
              if (window == "Cosine") {
                  xs_window[n] = Math.sin(Math.PI * n / N) * xs[n];
              } else if (window == "Hanning") {
                  xs_window[n] = 0.5 * (1 - Math.cos(2 * Math.PI * n / (N - 1))) * xs[n];
              } else if (window == "Hamming") {
                  xs_window[n] = (0.53836 - .46164 * Math.cos(2 * Math.PI * n / (N - 1))) * xs[n];
              } else if (window == "Blackman") {
                  xs_window[n] = (0.42 - .5 * Math.cos(2 * Math.PI * n / (N - 1)) + .08 * Math.cos(4 * Math.PI * n / (N - 1))) * xs[n];

              } else if (window == "None") {
                  xs_window[n] = xs[n];
              }
          
      }
      last = "Data";
      Plot();
      DisplayDFT();
    
}
function eraseText() {
    document.getElementById("textArea").value = "";
}

function dft(inReal, inImag) {
  TWO_PI = 2*Math.PI
  let n = inReal.length;
  let outReal = new Array(n);
  let outImag = new Array(n);
  for (let k = 0; k < n; k += 1) {  
    let sumReal = 0;
    let sumImag = 0;
    for (let t = 0; t < n; t += 1) {  
      let angle = TWO_PI * t * k / n;
      sumReal +=  inReal[t] * Math.cos(angle) + inImag[t] * Math.sin(angle);
      sumImag += -inReal[t] * Math.sin(angle) + inImag[t] * Math.cos(angle);
    }
    outReal[k] = sumReal;
    outImag[k] = sumImag;
  }
  return [outReal, outImag];
}


function preparePlot(){
  if (document.getElementById("check1").checked) {
    document.getElementById("logscale").checked = false;
  }
  if (document.getElementById("check2").checked) {
    document.getElementById("logscale").checked = false;
  }

  if (last == "Function"){prepareFunction();
} else{
  prepareData();
}

    DisplayDFT();
}


 function convertirAFecha(fechaEnMilisegundos) {
     var fecha = new Date(fechaEnMilisegundos*1000);
     var opciones = {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
         timeZone: 'UTC'  // Configurar la zona horaria a UTC
     };
     return fecha.toLocaleString('es-ES', opciones);
 }


 function filterWords (text)  {
    const wordList = text.split(" ");
    let trimmedWordList = [];

    for (let index = 0; index < wordList.length; index++) {
        trimmedWordList.push(wordList[index].trim());
    }

    return trimmedWordList.filter(function (e) {
        return e !== "";
})
}

function plotXY_out(){
var plotOut = document.getElementById("plot_dataXY");
if (plotOut.style.display === "none") {
    plotOut.style.display = "block";
    fourier();
  } else {
    plotOut.style.display = "none";
  }

}

function DFTData_out(){
var plotOut = document.getElementById("textAreaDFT");
if (plotOut.style.display === "none") {
    plotOut.style.display = "block";
    DisplayDFT();
  } 
else {
    plotOut.style.display = "none";
  }
if (plotOut.style.display === "block") {
    DisplayDFT();
  }

}
function fourier(){
var k = parseInt(document.getElementById("k").value);
var YCos = [];
var YSin = [];
var fft_re = 0;
var fft_im = 0;
var fft_abs = 0;
if (last == "Data"){
    XaxisDFTk = frec;
} 
for (var i = 0; i < xs_window.length; i++) {
    YCos.push(Math.cos(2 * Math.PI * i / xs_window.length * k));
    YSin.push(Math.sin(2 * Math.PI * i / xs_window.length * k));
    fft_re += Math.cos(2 * Math.PI * i / xs_window.length * k) * xs_window[i];
    fft_im += -Math.sin(2 * Math.PI * i / xs_window.length * k) * xs_window[i];
    }
    fft_re = Math.round(fft_re * 100) / 100;
    fft_im = Math.round(fft_im * 100) / 100;
    fft_abs = Math.round(Math.sqrt(fft_re*fft_re + fft_im*fft_im)*100)/100;
var traceCos = {
x: XaxisDFTk,
y: YCos,
  mode: 'markers+lines',
  name: 'Cos',
    line: {
    color: 'green',
    width: 2,
    dash: 'line'
  },
	marker: {
              color: 'green',
              size: 4,
              },
              type: 'scatter',

};
var traceSin = {
x: XaxisDFTk,
y: YSin,
  mode: 'markers+lines',
  name: 'Sin',
    line: {
    color: 'red',
    width: 2,
    dash: 'line'
  },
   marker: {
              color: 'red',
              size: 4,
              },
              type: 'scatter',
};
frequency = Math.round(k/totalTime*100000)/100000;

   var dataXY =[traceCos, traceSin]
    var layoutXY = {
              xaxis: {
                //range: [-1.1, 1.1],
                title:  titleDFTk
              },
              yaxis: {
                  range: [-1.1, 1.1],
                  title: "Amplitude " 
              },
              title: "Re = " + String(fft_re) +" ; Im = " + String(fft_im) + "<br>Abs Value = "+ String(fft_abs) + "; Frequency = "+ String(frequency) + "/"+samplingIntervalUnit,font: {
    family: 'Arial, sans-serif;',
    size: 18,
    color: '#000'
		       },
};
    Plotly.purge("plot_dataXY");
    Plotly.newPlot("plot_dataXY", dataXY, layoutXY);
}
function DisplayDFT (){
  if (document.getElementById("logscale").checked) {
  var dftText = "Index".padEnd(20, ' ')  + "Real".padEnd(20, ' ')  + "Imag".padEnd(20, ' ') +  "Log(Abs)".padEnd(20, ' ') +"\n";
}else{
  var dftText = "Index".padEnd(20, ' ')  + "Real".padEnd(20, ' ')  + "Imag".padEnd(20, ' ') +  "Abs".padEnd(20, ' ') +"\n";
}
for (var i = 0; i < my_X_real.length; i++) {

  dftText += i.toFixed(0).padEnd(20, ' ') + my_X_real[i].toFixed(2).padEnd(20, ' ') + my_X_imag[i].toFixed(2).padEnd(20, ' ')  + my_X_abs[i].toFixed(2).padEnd(20, ' ') +"\n" ;
}


      document.getElementById('textAreaDFT').value = dftText;

}

function formatComplex(c) {
      const realStr = c.real.toFixed(2);
      const imagStr = Math.abs(c.imag).toFixed(2);
      const sign = c.imag >= 0 ? ' + ' : ' - ';
      return `${realStr}${sign}${imagStr}i`;
    }
