# Discrete-Fourier-Transform-Plotter
This Web App calculates and plots the Discrete Fourier Transform (DFT). You can use a functions or you can paste your data sample. It also illustrates the use of window functions.


## Usage

- Clone the repository
- Open the file index.html with any web browser


This demo also illustrates the use of window functions and a simple spectrogram.

## Online FFT/DFT Calculator and Plotter

https://ciiec.buap.mx/FFT-Plotter/

## Usage

   Assuming x is the time domain array of size N with the sampled data, where N is a power of 2, then


     fft = FFT(x);
  
     X_real = new Array(my_x.length / 2).fill(0);
  
     X_imag = new Array(my_x.length / 2).fill(0);
  
     X_abs = new Array(my_x.length / 2).fill(0);
  
     for (var i = 0; i < N / 2; i += 1) {
  
         X_real[i] = fft[i].re;
      
         X_imag[i] = fft[i].im;
      
         X_abs[i] = Math.sqrt(fft[i].re * fft[i].re + fft[i].im * fft[i].im);
  
     }

where 

  fft is FFT{x} and X_real, X_imag and X_abs  are the frequency domain arrays containing the real, imaginary and absolute values, respectively. The size of fft is N and the size of the other arrays is N/2.


## Credits

- The FFT function was adapted from https://rosettacode.org/wiki/Fast_Fourier_transform#JavaScript

## License

[MIT](LICENSE)
