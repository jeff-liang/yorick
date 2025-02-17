import FFT from "fft.js"; // You'll need to install this package

function nextPowerOf2(n: number): number {
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

function discreteTrianglePMF(n: number): [number[], number[]] {
  const x: number[] = [];
  const pmf: number[] = [];

  for (let k = -n; k <= n; k++) {
    x.push(k);
    pmf.push((n + 1 - Math.abs(k)) / Math.pow(n + 1, 2));
  }

  return [x, pmf];
}

/**
 * Computes the PDF of the sum of N iid discrete triangle distributions using FFT
 * @param n Support of individual distribution [-n, n]
 * @param N Number of distributions to sum
 * @returns [x, pdf] where x is the first support element and pdf are the probability values
 */
export function sumTriangleDistributions(
  n: number,
  N: number,
): [number, number[]] {
  // For N=1, return the original distribution
  if (N === 1) {
    const [x, pmf] = discreteTrianglePMF(n);
    return [x[0], pmf];
  }

  // Get the original PMF
  const [, pmf] = discreteTrianglePMF(n);

  // Calculate the size needed for FFT
  // The support of sum will be [-N*n, N*n]
  const finalSupport = 2 * N * n + 1;
  const fftSize = nextPowerOf2(finalSupport);

  // Initialize FFT
  const fft = new FFT(fftSize);

  // Pad the PMF with zeros to fftSize
  const paddedPMF = new Float64Array(fftSize);
  const startIdx = Math.floor((fftSize - pmf.length) / 2);
  pmf.forEach((val, idx) => {
    paddedPMF[startIdx + idx] = val;
  });

  // Transform to frequency domain
  const spectrum = fft.createComplexArray();
  fft.realTransform(spectrum, paddedPMF);

  // Take the Nth power in frequency domain
  for (let i = 0; i < fftSize; i++) {
    const r = spectrum[2 * i];
    const j = spectrum[2 * i + 1];
    const magnitude = Math.pow(Math.sqrt(r * r + j * j), N);
    const phase = Math.atan2(j, r) * N;
    spectrum[2 * i] = magnitude * Math.cos(phase);
    spectrum[2 * i + 1] = magnitude * Math.sin(phase);
  }

  // Transform back to time domain
  const output = fft.createComplexArray();
  fft.inverseTransform(output, spectrum);

  // Extract the relevant part of the result
  const resultStart = Math.floor((fftSize - finalSupport) / 2);
  const resultEnd = resultStart + finalSupport;

  const resultPDF: number[] = [];

  for (let i = resultStart; i < resultEnd; i++) {
    // Take real part and ensure non-negative probabilities
    resultPDF.push(Math.max(0, output[2 * i]));
  }

  // Normalize to ensure sum = 1
  const sum = resultPDF.reduce((a, b) => a + b, 0);
  const normalizedPDF = resultPDF.map((p) => p / sum);

  return [-N * n, normalizedPDF];
}

export function sumTriangleDistributionsCdf(n: number, N: number) {
  const [x, pdf] = sumTriangleDistributions(n, N);
  const cdf = new Array(pdf.length);
  let sum = 0;
  for (let i = 0; i < pdf.length; i++) {
    sum += pdf[i];
    cdf.push(sum);
  }
  return [x, cdf];
}
