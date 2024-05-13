  var T = document.getElementById("time").value;
  var sampling_rate = document.getElementById("sampling").value;
  var N = parseInt(T * sampling_rate);
  var title ;
  var titleDFT;
  var ts ;
  var xs;
  var xs_window ;
  var frec ;
  var last = "Function";
var samplingIntervalData;
var samplingIntervalUnit;


  var f_Nyquist = sampling_rate / 2;
  var my_X_real ;
  var my_X_imag ;
  var my_X_abs ;
  
window.onresize = function(){ location.reload(); }


  //Plot();











function prepareFunction(){
  title = "Samples in Time Domain";

var fun = document.getElementById("func");
      var f1_fun = document.getElementById("f1");
      var f2_fun = document.getElementById("f2");
      T = document.getElementById("time").value;
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
          frec[n] = n / T;
      }
      var window = document.getElementById("window").value;
      for (var n = 0; n < N; n += 1) {
          var t = n / N * T;

          with(Math) {
              var f1 = eval(f1_fun.value);
              var f2 = eval(f2_fun.value);
              xs[n] = eval(fun.value);
              if (window == "Cosine") {
                  xs_window[n] = sin(PI * n / N) * eval(fun.value);
              } else if (window == "Hanning") {
                  xs_window[n] = 0.5 * (1 - cos(2 * PI * n / (N - 1))) * eval(fun.value);
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
    console.log("my_x = "+ my_x);
    console.log("my_x.length = "+ my_x.length);
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
      var data1 = [{
          x: ts,
          y: xs_window,
          mode: "lines+markers"
      }];


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
              title: "Frequency (Hz)"
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
              title: "Frequency (1/"+samplingIntervalUnit+")"
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
    const separator = String(document.getElementById("separator").value);
    samplingIntervalData = parseFloat(document.getElementById("samplingIntervalData").value);
    samplingIntervalUnit = document.getElementById("samplingIntervalUnit").value;

    const columnX = parseInt(String(document.getElementById("columnX").value));
    const columnY = parseInt(String(document.getElementById("columnY").value));


    var myArray = myText.split("\n");
    N = myArray.length; 
    ts = new Array(N).fill(0);
    xs = new Array(N).fill(0);
    xs_window = new Array(N).fill(0);

    frec = new Array(N).fill(0);
    for (var i = 0; i < myArray.length ; i += 1) {
      var myRow = myArray[i].split(separator);
      //ts[i] = i;
      ts[i] = parseFloat(myRow[columnX]);
      
      xs[i] = parseFloat(myRow[columnY]);
      frec[i] = i / (N*samplingIntervalData);

      }

    var window = document.getElementById("window").value;
      for (var n = 0; n < N; n += 1) {
              if (window == "Cosine") {
                  xs_window[n] = sin(PI * n / N) * xs[n];
              } else if (window == "Hanning") {
                  xs_window[n] = 0.5 * (1 - cos(2 * PI * n / (N - 1))) * xs[n];
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
  if (last == "Function"){prepareFunction();
} else{
  prepareData();
}
}
