var listy = [];
var showingHistogram = false;
var showingSampleHistogram = false;
var thatcol;
var thatrow;
var data;
var datalist;
var salaries;
var xmin = 337000;
var xmax = 10000000;
var binWidth = 500000;
var xint = 200;
var xscale;
var yscale;
var freqs = [];
var tempfreqs = [];
var n = 81;
var N;
var currentSample = [];
var allxbars = [];
var allprops = [];
var frequencies;
var samplefreqs;
var minValue;
var maxValue;
var valueRange;
var numBins;
var canvasWidth;
var canvasHeight;
var xMargin; // Renamed from 'margin' for clarity
var yMargin; // New variable for vertical scaling
var xshift;
var maxFrequency;
var maxFrequencySamples;
var barWidth;
var buttons = [];
var ticker;
var cx1;
var cx2;
var cy1;
var cy2;

var xWidth;
var yHeight; // NEW VARIABLE

function preload() {
  var cacheBuster = new Date().getTime();
  data = loadTable("mlb_salary_data2008.csv?v=" + cacheBuster, "csv");
}

function numberRight(n) {
  const number = n;
  const options = {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  return number.toLocaleString('en-US', options);
}

function numberRight2(n) {
  const number = n;
  const options = {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  return number.toLocaleString('en-US', options);
}

function generateRandomArray(n) {
  const initialArray = Array.from({
    length: n + 1
  }, (_, index) => index);
  for (let i = initialArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [initialArray[i], initialArray[j]] = [initialArray[j], initialArray[i]];
  }
  return initialArray;
}

function setup() {
  xWidth = windowWidth;
  yHeight = windowHeight; // Initialize to browser height

  createCanvas(xWidth, yHeight);
  background(229);

  salaries = data.getColumn(4);
  N = salaries.length;
  thatcol2 = data.getColumn(1);
  for (var v = 0; v < salaries.length; v++) {
    salaries[v] = parseFloat(salaries[v]);
  }

  // Y Refactor: 595 -> 0.74375, 5 -> 0.00625, 745 -> 0.93125
  buttons.push(new button(0.5714 * xWidth, 0.7438 * yHeight, "ONE"));
  buttons.push(new button(0.6429 * xWidth, 0.7438 * yHeight, "TEN"));
  buttons.push(new button(0.7143 * xWidth, 0.7438 * yHeight, "100"));
  buttons.push(new button(0.7857 * xWidth, 0.7438 * yHeight, "RUN"));

  buttons.push(new button(0.7857 * xWidth, 0.0063 * yHeight, "Data Values"));
  buttons.push(new button(0.8571 * xWidth, 0.0063 * yHeight, "Histogram"));

  buttons.push(new button(0.6429 * xWidth, 0.9313 * yHeight, "Dot Plot"));
  buttons.push(new button(0.7143 * xWidth, 0.9313 * yHeight, "Histogram."));

  drawHistogram(salaries, 500000, [100, 150, 200]);
  samplingDistributionDot();
  samplingPanel();
  populationPanel();
}

function samplingPanel() {
  textAlign(CENTER, TOP);
  fill(250);
  stroke(220, 120, 20, 150);

  // Rect Y: 510 -> 0.6375, Height: 275 -> 0.3438
  rect(0.4857 * xWidth, 0.6375 * yHeight, 0.4571 * xWidth, 0.3438 * yHeight, 6);
  noStroke();
  fill(220, 120, 20);
  textSize(28);

  // Text Y: 510+10 -> 0.6375 + 0.0125 = 0.65
  text("SAMPLING DISTRIBUTION", 0.7143 * xWidth, 0.65 * yHeight);
  textSize(20);
  fill(220, 120, 20);
  // Text Y: 560 -> 0.7
  text("Sample Size, n = " + n, 0.7143 * xWidth, 0.7 * yHeight);
  fill(247);

  if (allxbars.length > 0) {
    // Rect Y: 5 -> 0.0063, Height: 400 -> 0.5
    rect(0.5000 * xWidth, 0.0063 * yHeight, 0.4643 * xWidth, 0.5 * yHeight, 6);
    fill(220, 120, 20);
    textSize(18);
    // Text Y: 650 -> 0.8125
    text("Number of Total Samples: " + allxbars.length, 0.7143 * xWidth, 0.8125 * yHeight);
    // Text Y: 680 -> 0.85
    text("Average of " + allxbars.length + " samples:  μₓ̄ = " + numberRight(avga(allxbars)), 0.7143 * xWidth, 0.85 * yHeight);
    // Text Y: 710 -> 0.8875
    text("SD of " + allxbars.length + " samples:  σₓ̄ = " + numberRight(StandardDeviation(allxbars)), 0.7143 * xWidth, 0.8875 * yHeight);
    textSize(26);
    textAlign(LEFT, TOP);
    // Text Y: 5 -> 0.0063
    text("Current Sample", 0.5357 * xWidth, 0.0063 * yHeight);
  }

  textSize(10);

  var maxy = 0;
  if (showingSampleHistogram) {
    drawSmallHistogram(currentSample, 500000, [220, 120, 20]);
    cx1 = 0.5357 * xWidth;
  } else {
    for (var i = 0; i < currentSample.length; i++) {
      // Y calc: 60 -> 0.075, 25 -> 0.0313
      var xxx = (0.5357 * xWidth) + (0.0429 * xWidth) * (i % 10);
      var yyy = (0.075 * yHeight) + (0.0313 * yHeight) * floor(i / 10);
      if (yyy > maxy) {
        maxy = yyy;
      }
      text(numberRight2(currentSample[i]), xxx, yyy);
      cx1 = 0.5357 * xWidth;
    }
  }

  textSize(20);

  if (allxbars.length > 0) {
    textAlign(LEFT, TOP);
    // Offset 40 -> 0.05
    drawXbar(cx1, maxy + 0.05 * yHeight, [220, 120, 20]);
    text(" = " + numberRight(allxbars[allxbars.length - 1]), cx1 + (0.0143 * xWidth), maxy + 0.05 * yHeight);
    cy1 = maxy + 0.05 * yHeight;
    stroke(220, 120, 20);
    if (showingHistogram === false) {
      // Offset 9 -> 0.0113 (approx)
      line(cx1, cy1 + 0.0113 * yHeight, cx2, cy2);
    }
  }

  for (var s = 0; s < buttons.length; s++) {
    buttons[s].showit();
  }
}

function populationPanel() {
  textAlign(CENTER, TOP);
  fill(250);
  stroke(20, 100, 220);

  // Rect Y: 510 -> 0.6375, Height: 275 -> 0.3438
  rect(0.1071 * xWidth, 0.6375 * yHeight, 0.3571 * xWidth, 0.3438 * yHeight, 6);
  noStroke();
  fill(20, 100, 220);
  textSize(28);

  // Text Y: 510+10 -> 0.65
  text("THE POPULATION", 0.2857 * xWidth, 0.65 * yHeight);
  textSize(24);
  // Text Y: 570 -> 0.7125
  text("857 MLB Players from 2008", 0.2857 * xWidth, 0.7125 * yHeight);
  textSize(22);
  // Text Y: 610 -> 0.7625
  text("Variable: Salary    (Quantitative)", 0.2857 * xWidth, 0.7625 * yHeight);

  textAlign(RIGHT, TOP);
  // Text Y: 660 -> 0.825
  text("Mean:", 0.2357 * xWidth, 0.825 * yHeight);
  // Text Y: 705 -> 0.8813
  text("SD:", 0.2357 * xWidth, 0.8813 * yHeight);

  textAlign(LEFT, TOP);
  text("μ = " + numberRight(avga(salaries)), 0.2643 * xWidth, 0.825 * yHeight);
  text("σ = " + numberRight(StandardDeviation(salaries)), 0.2643 * xWidth, 0.8813 * yHeight);
}

function decide() {
  if (showingHistogram) {
    samplingDistribution();
  } else {
    samplingDistributionDot();
  }
}

function samplingDistribution() {
  for (let number of allxbars) {
    const binIndex = floor((number - minValue) / binWidth);
    samplefreqs[binIndex]++;
  }
  maxFrequencySamples = max(samplefreqs);
  fill(220, 120, 20, 150);
  for (let i = 0; i < samplefreqs.length; i++) {
    // using canvasHeight and yMargin (which are set in drawHistogram/drawSmallHistogram logic implicitly, 
    // but this function relies on the last known canvasHeight/Margin. 
    // Ideally, these should be passed in, but relying on global state as per original code structure)
    // NOTE: margin was 50 -> 0.0625 * yHeight
    const barHeight = map(samplefreqs[i], 0, maxFrequencySamples, canvasHeight - yMargin, yMargin);
    const xPos = xMargin + i * barWidth;
    rect(xshift + xPos, barHeight, barWidth, canvasHeight - yMargin - barHeight);
  }
}

function samplingDistributionDot() {
  var rememb;
  for (let number of allxbars) {
    const binIndex = floor((number - minValue) / binWidth);
    samplefreqs[binIndex]++;
    rememb = binIndex;
  }
  fill(220, 120, 20, 150);
  for (let i = 0; i < samplefreqs.length; i++) {
    const xPos = xMargin + i * barWidth;
    if (i === rememb) {
      cx2 = xshift + xPos + barWidth / 2;
      // 10 * samplefreqs -> we should scale the '10' pixels per dot too? 
      // 10/800 = 0.0125. 5 -> 0.00625.
      cy2 = canvasHeight - yMargin - (0.0125 * yHeight) * samplefreqs[i] + (0.0063 * yHeight);
    }
    for (let t = 0; t < samplefreqs[i]; t++) {
      ellipse(xshift + xPos + barWidth / 2, canvasHeight - yMargin - (0.0063 * yHeight) - (0.0125 * yHeight) * t, 10);
    }
  }
}

function drawMu(x, y) {
  textAlign(CENTER, CENTER);
  text('\u03BC', x, y);
}

function drawXbar(ax, ay, fillg) {
  fill(fillg);
  noStroke();
  text("X", ax, ay);
  stroke(fillg);
  strokeWeight(2);
  line(ax - 2, ay - 1, ax + textSize() - 6, ay - 1);
  noStroke();
}

function drawHistogram(numbers, binWidth, thisfill) {
  textSize(10);

  canvasWidth = 0.8571 * xWidth;
  // CanvasHeight: 500 -> 0.625
  canvasHeight = 0.625 * yHeight;
  
  // xMargin based on width (previous step): 50/1400 = 0.0357
  xMargin = 0.0357 * xWidth; 
  // yMargin based on height (this step): 50/800 = 0.0625
  yMargin = 0.0625 * yHeight;

  xshift = 0.1071 * xWidth;

  fill(240);
  rect(0 + xshift, 0, canvasWidth, canvasHeight);

  minValue = min(numbers);
  maxValue = max(numbers);
  valueRange = maxValue - minValue;

  var xForMean = map(avga(salaries), minValue, maxValue, xshift + xMargin, xshift + canvasWidth - xMargin);
  strokeWeight(4);
  stroke(20, 100, 220);
  // 30 -> 0.0375
  line(xForMean, canvasHeight - yMargin, xForMean, canvasHeight - yMargin + 0.0375 * yHeight);
  noStroke();
  textSize(18);
  fill(20, 100, 220);
  // 40 -> 0.05
  drawMu(xForMean, canvasHeight - yMargin + 0.05 * yHeight, 0);

  numBins = ceil(valueRange / binWidth);
  frequencies = Array(numBins).fill(0);
  samplefreqs = Array(numBins).fill(0);

  for (let number of numbers) {
    const binIndex = floor((number - minValue) / binWidth);
    frequencies[binIndex]++;
  }

  maxFrequency = max(frequencies);
  barWidth = (canvasWidth - 2 * xMargin) / numBins;

  stroke(0);
  strokeWeight(2);
  fill(0);
  // Using yMargin for Y coords, xMargin for X coords
  line(xshift + xMargin, canvasHeight - yMargin, xshift + canvasWidth - xMargin, canvasHeight - yMargin);
  line(xshift + xMargin, canvasHeight - yMargin, xshift + xMargin, yMargin);

  noStroke();
  textAlign(CENTER, CENTER);
  textSize(10);
  for (let i = 0; i < numBins; i += 4) {
    const xPos = xMargin + i * barWidth;
    const label = parseFloat(nf(minValue + i * binWidth, 0, 2));
    // -10 -> -0.0125
    text(label.toLocaleString(), xshift + xPos, -0.0125 * yHeight + canvasHeight - yMargin / 2);
    stroke(0);
    // 8 -> 0.01
    line(xshift + xPos, canvasHeight - yMargin, xshift + xPos, canvasHeight - yMargin + 0.01 * yHeight);
    noStroke();
  }

  textAlign(RIGHT, CENTER);
  for (let i = 0; i <= maxFrequency; i += 15) {
    const yPos = map(i, 0, maxFrequency, canvasHeight - yMargin, yMargin);
    text(i, xshift + xMargin - (0.0036 * xWidth), yPos);
  }

  fill(thisfill);
  stroke(0);

  for (let i = 0; i < numBins; i++) {
    const barHeight = map(frequencies[i], 0, maxFrequency, canvasHeight - yMargin, yMargin);
    const xPos = xMargin + i * barWidth;
    rect(xshift + xPos, barHeight, barWidth, canvasHeight - yMargin - barHeight);
  }
}

function drawSmallHistogram(numbers, binWidth, thisfill) {
  canvasWidth = 0.4643 * xWidth;
  // CanvasHeight: 400 -> 0.5
  canvasHeight = 0.5 * yHeight;
  
  // xMargin: 10/1400 = 0.0071
  xMargin = 0.0071 * xWidth;
  // yMargin: 10/800 = 0.0125
  yMargin = 0.0125 * yHeight;
  
  xshift = 0.5000 * xWidth;

  fill(247);

  minValue = min(numbers);
  maxValue = max(numbers);
  valueRange = maxValue - minValue;

  numBins = ceil(valueRange / binWidth);
  frequencies = Array(numBins).fill(0);

  for (let number of numbers) {
    const binIndex = floor((number - minValue) / binWidth);
    frequencies[binIndex]++;
  }

  maxFrequency = max(frequencies);
  barWidth = (canvasWidth - 2 * xMargin) / numBins;

  stroke(0);
  strokeWeight(2);
  fill(0);
  line(xshift + xMargin, canvasHeight - yMargin, xshift + canvasWidth - xMargin, canvasHeight - yMargin);
  line(xshift + xMargin, canvasHeight - yMargin, xshift + xMargin, yMargin);

  fill(thisfill);
  stroke(0);

  for (let i = 0; i < numBins; i++) {
    const barHeight = map(frequencies[i], 0, maxFrequency, canvasHeight - yMargin, yMargin);
    const xPos = xMargin + i * barWidth;
    rect(xshift + xPos, barHeight, barWidth, canvasHeight - yMargin - barHeight);
  }
}

function StandardDeviation(arr) {
  let mean = arr.reduce((acc, curr) => {
    return acc + curr
  }, 0) / arr.length;
  arr = arr.map((k) => {
    return (k - mean) ** 2
  });
  let sum = arr.reduce((acc, curr) => acc + curr, 0);
  return Math.sqrt(sum / arr.length)
}

function avga(list) {
  var runsum = 0;
  for (var n = 0; n < list.length; n++) {
    runsum += list[n];
  }
  return runsum / list.length;
}

function sampleOne() {
  var these = indexes(n, N - 1);
  var xbar;
  var phat;
  var k = 0;
  var thisSample = [];
  for (var b = 0; b < these.length; b++) {
    thisSample.push(salaries[these[b]]);
    if (salaries[these[b]] >= 1000000) {
      k++;
    }
  }
  currentSample = thisSample;
  xbar = avga(thisSample);
  phat = k / n;
  allxbars.push(xbar);
  allprops.push(phat);
}

function indexes(k, n) {
  if (k > n + 1) {
    throw new Error("Cannot select more distinct integers than the size of the range.");
  }
  const result = [];
  const availableNumbers = Array.from({
    length: n + 1
  }, (_, index) => index);

  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedNumber = availableNumbers.splice(randomIndex, 1)[0];
    result.push(selectedNumber);
  }
  return result;
}

function runit() {
  for (var y = 0; y < 500; y++) {
    sampleOne();
  }
  drawHistogram(salaries, 500000, [100, 150, 200]);
  decide();
  samplingPanel();
}

function touchStarted() {
  for (var z = 0; z < buttons.length; z++) {
    buttons[z].tapit();
  }
}

function touchEnded() {}

function keyTyped() {
  if (key === "u") {
    n++;
    console.log(n);
    samplingPanel();
  } else if (key === "d") {
    n--;
    console.log(n);
    samplingPanel();
  }
}

class button {
  constructor(x, y, fun) {
    this.x = x;
    this.y = y;
    this.fun = fun;
    if (y < 0.2 * yHeight || y > 0.8 * yHeight) { // Logic check using relative height for top/bottom detection
      this.w = 0.0714 * xWidth;
      this.h = 0.0375 * yHeight; // 30 -> 0.0375
    } else {
      this.w = 0.0571 * xWidth;
      this.h = 0.0375 * yHeight;
      this.always = true;
    }

  }

  showit() {
    textAlign(CENTER, CENTER);
    textSize(15);
    if ((allxbars.length > 0 && showingSampleHistogram && this.fun === "Histogram") || (allxbars.length > 0 && showingSampleHistogram === false && this.fun === "Data Values") || (allxbars.length > 0 && showingHistogram === false && this.fun === "Dot Plot") || (allxbars.length > 0 && showingHistogram === true && this.fun === "Histogram.")) {
      fill(255, 200, 200);
    } else {
      fill(250);
    }
    if (allxbars.length > 0 || this.always === true) {
      stroke(30);
      rect(this.x, this.y, this.w, this.h);
      noStroke();
      fill(10);
      text(this.fun, this.x + .5 * this.w, this.y + .5 * this.h);

    }
  }

  tapit() {
    if (mouseX >= this.x && mouseX <= this.x + this.w && mouseY >= this.y && mouseY <= this.y + this.h) {
      if (this.fun === "ONE") {
        sampleOne();
        drawHistogram(salaries, 500000, [100, 150, 200]);
        decide();
        samplingPanel();
      } else if (this.fun === "TEN") {
        for (var y = 0; y < 10; y++) {
          sampleOne();
        }
        drawHistogram(salaries, 500000, [100, 150, 200]);
        decide();
        samplingPanel();
      } else if (this.fun === "100") {
        for (var y = 0; y < 100; y++) {
          sampleOne();
        }
        drawHistogram(salaries, 500000, [100, 150, 200]);
        decide();
        samplingPanel();
      } else if (this.fun === "RUN") {
        this.fun = "STOP";
        ticker = setInterval(runit, 20);
      } else if (this.fun === "STOP") {
        drawHistogram(salaries, 500000, [100, 150, 200]);
        clearInterval(ticker);
        this.fun = "RUN";
        decide();
        samplingPanel();
      } else if (this.fun === "Data Values") {
        showingSampleHistogram = false;
        drawHistogram(salaries, 500000, [100, 150, 200]);
        decide();
        samplingPanel();
      } else if (this.fun === "Histogram") {
        showingSampleHistogram = true;
        drawHistogram(salaries, 500000, [100, 150, 200]);
        decide();
        samplingPanel();
      } else if (this.fun === "Dot Plot" && allxbars.length < 5000) {
        showingHistogram = false;
        drawHistogram(salaries, 500000, [100, 150, 200]);
        decide();
        samplingPanel();
      } else if (this.fun === "Histogram.") {
        showingHistogram = true;
        drawHistogram(salaries, 500000, [100, 150, 200]);
        decide();
        samplingPanel();
      }
    }
  }
}
