var listy = [];
var showingHistogram=false;
var showingSampleHistogram=false;
var thatcol;
var thatrow;
var data;
var datalist;
var salaries;
var xmin=337000;
var xmax=10000000;
var binWidth=500000;
var xint=200;
var xscale;
var yscale;
var freqs=[];
var tempfreqs=[];
var n=81;
var N;
var currentSample=[];
var allxbars=[];
var allprops=[];
var frequencies;
var samplefreqs;
var minValue;
var maxValue;
var valueRange;
var numBins;
var canvasWidth;
var canvasHeight;
var margin;
var xshift;
var maxFrequency;
var maxFrequencySamples;
var barWidth;
var buttons=[];
var ticker;
var cx1;
var cx2;
var cy1;
var cy2;

function preload() {
  data = loadTable("mlb_salary_data2008.csv", "csv");
}


function numberRight(n){
  const number = n;

// Using default formatting (based on user's locale)
const formattedNumberDefault = number.toLocaleString();

// Specifying a specific locale (e.g., en-US)
const formattedNumberUS = number.toLocaleString('en-US');

// Specifying options for formatting
const options = {
  style: 'decimal',  // Other options: 'currency', 'percent', etc.
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};
const formattedWithOptions = number.toLocaleString('en-US', options);
return formattedWithOptions; // Output: "1,234,567.89"
}

function numberRight2(n){
  const number = n;

// Using default formatting (based on user's locale)
const formattedNumberDefault = number.toLocaleString();

// Specifying a specific locale (e.g., en-US)
const formattedNumberUS = number.toLocaleString('en-US');

// Specifying options for formatting
const options = {
  style: 'decimal',  // Other options: 'currency', 'percent', etc.
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};
const formattedWithOptions = number.toLocaleString('en-US', options);
return formattedWithOptions; // Output: "1,234,567.89"
}





function generateRandomArray(n) {
  // Create an array with integers from 0 to n
  const initialArray = Array.from({ length: n + 1 }, (_, index) => index);

  // Fisher-Yates Shuffle Algorithm to shuffle the array
  for (let i = initialArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [initialArray[i], initialArray[j]] = [initialArray[j], initialArray[i]];
  }

  return initialArray;
}







function setup() {
  createCanvas(1400, 800);
  background(229);
  salaries = data.getColumn(4);
  N=salaries.length;
  thatcol2 = data.getColumn(1);
  for(var v=0;v<salaries.length;v++){
    salaries[v]=parseFloat(salaries[v]);
    
  }
  buttons.push(new button(800,595,"ONE"));
  buttons.push(new button(900,595,"TEN"));
  buttons.push(new button(1000,595,"100"));
  buttons.push(new button(1100,595,"RUN"));
  buttons.push(new button(1100,5,"Data Values"));
  buttons.push(new button(1200,5,"Histogram"));
  buttons.push(new button(900,745,"Dot Plot"));
  buttons.push(new button(1000,745,"Histogram."));
  
  
  

  drawHistogram(salaries,500000,[100, 150, 200]);
  //samplingDistribution();
  samplingDistributionDot();

  samplingPanel();
  populationPanel();

  
}

function samplingPanel(){
  textAlign(CENTER,TOP);
  fill(250);
  stroke(220,120,20,150);
  rect(680,510,640,275,6);
  noStroke();
  fill(220,120,20);
  textSize(28);
  text("SAMPLING DISTRIBUTION",1000,510+10);
  textSize(20);
  fill(220,120,20);
  text("Sample Size, n = "+n,1000,560);
  fill(247);

  if(allxbars.length>0){
    rect(700,5,650,400,6);
    fill(220,120,20);
    textSize(18);
    text("Number of Total Samples: "+allxbars.length,1000,650);
    text("Average of "+allxbars.length+" samples:  μₓ̄ = "+numberRight(avga(allxbars)),1000,680);
    text("SD of "+allxbars.length+" samples:  σₓ̄ = "+numberRight(StandardDeviation(allxbars)),1000,710);
    textSize(26);
    textAlign(LEFT,TOP);
    text("Current Sample",750,5);
  }
  
  textSize(10);

  var maxy=0;
  if(showingSampleHistogram){
    drawSmallHistogram(currentSample,500000,[220,120,20]);
    cx1=750;
  }
  else{
  for(var i=0;i<currentSample.length;i++){
    var xxx=750+60*(i%10);
    var yyy=60+25*floor(i/10);
    if(yyy>maxy){maxy=yyy;}
    text(numberRight2(currentSample[i]),xxx,yyy);
    cx1=750;
  }
    
  }

  
  textSize(20);
  
    if(allxbars.length>0){
      
      textAlign(LEFT,TOP);
      drawXbar(cx1,maxy+40,[220,120,20]);
      text(" = "+numberRight(allxbars[allxbars.length-1]),cx1+20,maxy+40);
      cy1=maxy+40;
      stroke(220,120,20);
      if(showingHistogram===false){line(cx1,cy1+9,cx2,cy2);}
    }

  
  for(var s=0;s<buttons.length;s++){
    buttons[s].showit();
  }
}




function populationPanel(){
  textAlign(CENTER,TOP);
  fill(250);
  stroke(20,100,220);
  rect(150,510,500,275,6);
  noStroke();
  fill(20,100,220);
  textSize(28);
  text("THE POPULATION",400,510+10);
  textSize(24);
  text("857 MLB Players from 2008",400,570);
  textSize(22);
  text("Variable: Salary    (Quantitative)",400,610);
  textAlign(RIGHT,TOP);
  text("Mean:",330,660);
  text("SD:" ,330,705);
  
  textAlign(LEFT,TOP);
  text("μ = "+numberRight(avga(salaries)),370,660);
  text("σ = "+numberRight(StandardDeviation(salaries)),370,705);
}



function decide(){
  if(showingHistogram){samplingDistribution();}
  else{samplingDistributionDot();}
}



function samplingDistribution(){
        // Count the frequency of each bin
      for (let number of allxbars) {
        const binIndex = floor((number - minValue) / binWidth);
        samplefreqs[binIndex]++;
      }
  maxFrequencySamples=max(samplefreqs);
  fill(220,120,20,150);
        for (let i = 0; i < samplefreqs.length; i++) {
        const barHeight = map(samplefreqs[i], 0, maxFrequencySamples, canvasHeight - margin, margin);
        const xPos = margin + i * barWidth;
        rect(xshift+xPos, barHeight, barWidth, canvasHeight - margin - barHeight);
      }
}

function samplingDistributionDot(){
      var rememb;
          // Count the frequency of each bin
      for (let number of allxbars) {
        const binIndex = floor((number - minValue) / binWidth);
        samplefreqs[binIndex]++;
        rememb=binIndex;
        //remember which index inc's
      }
  fill(220,120,20,150);
        for (let i = 0; i < samplefreqs.length; i++) {
        const xPos = margin + i * barWidth;
          if(i===rememb){
            cx2=xshift+xPos+barWidth/2;
            cy2=canvasHeight-margin-10*samplefreqs[i]+5;
          }
          for(let t = 0; t < samplefreqs[i]; t++){
            ellipse(xshift+xPos+barWidth/2, canvasHeight-margin-5-10*t,10);
          }         
      } 
}



function drawMu(x, y) {
  textAlign(CENTER, CENTER);
  text('\u03BC', x, y); // '\u03BC' represents the Greek letter mu in Unicode
}

function drawXbar(ax,ay,fillg){  
  fill(fillg);
  noStroke();
  text("X",ax,ay);
  stroke(fillg);
  strokeWeight(2);
  line(ax-2,ay-1,ax+textSize()-6,ay-1);
  noStroke();
}



    function drawHistogram(numbers, binWidth,thisfill) {   
      textSize(10);
      canvasWidth = 1200;
      canvasHeight = 500;
      margin = 50;
      xshift=150; //xshift+
      fill(240);
      rect(0+xshift,0,canvasWidth,canvasHeight);


      // Calculate the range of values
      minValue = min(numbers);
      maxValue = max(numbers);
      valueRange = maxValue - minValue;

      // put the population mean on the histogram
      var xForMean=map(avga(salaries),minValue,maxValue,xshift+margin, xshift+canvasWidth - margin);
      strokeWeight(4);
      stroke(20,100,220);
      line(xForMean,canvasHeight-margin,xForMean,canvasHeight-margin+30);
      noStroke();
      textSize(18);
      fill(20,100,220);
      drawMu(xForMean,canvasHeight-margin+40,0);
  
      
      
      // Calculate the number of bins
      numBins = ceil(valueRange / binWidth);

      // Create an array to store the frequency of each bin
      // and plan on showing a sampling distribution with same intervals
      frequencies = Array(numBins).fill(0);
      samplefreqs=Array(numBins).fill(0);
      
      // Count the frequency of each bin
      for (let number of numbers) {
        const binIndex = floor((number - minValue) / binWidth);
        frequencies[binIndex]++;
      }

      // Calculate the maximum frequency
      maxFrequency = max(frequencies);

      // Calculate the width of each histogram bar
      barWidth = (canvasWidth - 2 * margin) / numBins;

      // Draw x-axis
      stroke(0);
      strokeWeight(2);
      fill(0);
      line(xshift+margin, canvasHeight - margin, xshift+canvasWidth - margin, canvasHeight - margin);

      // Draw y-axis
      line(xshift+margin, canvasHeight - margin, xshift+margin, margin);

      // Label x-axis
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(10);
      for (let i = 0; i < numBins; i+=4) {
        const xPos = margin + i * barWidth ;
        const label = parseFloat(nf(minValue + i * binWidth, 0, 2));
        text(label.toLocaleString(), xshift+xPos, -10+canvasHeight - margin / 2);
        stroke(0);
        line(xshift+xPos,canvasHeight-margin,xshift+xPos,canvasHeight-margin+8);
        noStroke();
      }

      // Label y-axis
      textAlign(RIGHT, CENTER);
      for (let i = 0; i <= maxFrequency; i+=15) {
        const yPos = map(i, 0, maxFrequency, canvasHeight - margin, margin);
        text(i, xshift+margin - 5, yPos);
      }

      // Draw histogram bars
      fill(thisfill);
      stroke(0);
      
      for (let i = 0; i < numBins; i++) {
        const barHeight = map(frequencies[i], 0, maxFrequency, canvasHeight - margin, margin);
        const xPos = margin + i * barWidth;
        rect(xshift+xPos, barHeight, barWidth, canvasHeight - margin - barHeight);
      }
    }



function drawSmallHistogram(numbers, binWidth,thisfill) {
      
      canvasWidth = 650;
      canvasHeight = 400;
      margin = 10;
      xshift=700; //xshift+
      fill(247);
      //rect(0+xshift,5,canvasWidth,canvasHeight);


      // Calculate the range of values
      minValue = min(numbers);
      maxValue = max(numbers);
      valueRange = maxValue - minValue;


      
      // Calculate the number of bins
      numBins = ceil(valueRange / binWidth);

      // Create an array to store the frequency of each bin
      frequencies = Array(numBins).fill(0);
      
      // Count the frequency of each bin
      for (let number of numbers) {
        const binIndex = floor((number - minValue) / binWidth);
        frequencies[binIndex]++;
      }

      // Calculate the maximum frequency
      maxFrequency = max(frequencies);

      // Calculate the width of each histogram bar
      barWidth = (canvasWidth - 2 * margin) / numBins;

      // Draw x-axis
      stroke(0);
      strokeWeight(2);
      fill(0);
      line(xshift+margin, canvasHeight - margin, xshift+canvasWidth - margin, canvasHeight - margin);

      // Draw y-axis
      line(xshift+margin, canvasHeight - margin, xshift+margin, margin);



      // Draw histogram bars
      fill(thisfill);
      stroke(0);
      
      for (let i = 0; i < numBins; i++) {
        const barHeight = map(frequencies[i], 0, maxFrequency, canvasHeight - margin, margin);
        const xPos = margin + i * barWidth;
        rect(xshift+xPos, barHeight, barWidth, canvasHeight - margin - barHeight);
      }
    }











  function StandardDeviation(arr) {
 
    // Creating the mean with Array.reduce
    let mean = arr.reduce((acc, curr) => {
        return acc + curr
    }, 0) / arr.length;
 
    // Assigning (value - mean) ^ 2 to
    // every array item
    arr = arr.map((k) => {
        return (k - mean) ** 2
    });
 
    // Calculating the sum of updated array 
    let sum = arr.reduce((acc, curr) => acc + curr, 0);
 
    // Calculating the variance
    let variance = sum / arr.length
 
    // Returning the standard deviation
    return Math.sqrt(sum / arr.length)
}
  
  







function avga(list){
  var runsum=0;
  for(var n=0;n<list.length;n++){
    runsum+=list[n];
  }
  return runsum/list.length;
}
  


function sampleOne(){
  var these=indexes(n,N-1);
  var xbar;
  var phat;
  var k=0;
  var thisSample=[];
  for(var b=0;b<these.length;b++){
    thisSample.push(salaries[these[b]]);
    if(salaries[these[b]]>=1000000){k++;}
  }
  currentSample=thisSample;
  xbar=avga(thisSample);
  phat=k/n;
  allxbars.push(xbar);
  allprops.push(phat);

}


function indexes(k, n) {
  if (k > n + 1) {
    throw new Error("Cannot select more distinct integers than the size of the range.");
  }
  const result = [];
  const availableNumbers = Array.from({ length: n + 1 }, (_, index) => index);

  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedNumber = availableNumbers.splice(randomIndex, 1)[0];
    result.push(selectedNumber);
  }
  return result;
}

function runit(){
  for(var y=0;y<500;y++){
    sampleOne();
  }
        drawHistogram(salaries,500000,[100, 150, 200]);
        decide();
        samplingPanel();
}



function touchStarted() {
  for(var z=0;z<buttons.length;z++){
    buttons[z].tapit();
  }
}

function touchEnded() {}



function keyTyped() {
  if (key === "s") {
    showingSampleHistogram=true;
    drawHistogram(salaries,500000,[100, 150, 200]);
    decide();
    samplingPanel();
    
  }
  
  else if (key === "h") {
    showingHistogram=true;
    drawHistogram(salaries,500000,[100, 150, 200]);
    decide();
    samplingPanel();
  }
  
}


class button{
  constructor(x,y,fun){
    this.x=x;this.y=y;this.fun=fun;
    if(y===5||y===745){   //the two top buttons
      this.w=100;
      this.h=30;
    }
    else{    //the sampling buttons
      this.w=80;
      this.h=30;
      this.always=true;
    }
 
  }
  
  showit(){
    textAlign(CENTER,CENTER);
    textSize(15);
    if((allxbars.length>0&&showingSampleHistogram&&this.fun==="Histogram")||(allxbars.length>0&&showingSampleHistogram===false&&this.fun==="Data Values")||(allxbars.length>0&&showingHistogram===false&&this.fun==="Dot Plot")||(allxbars.length>0&&showingHistogram===true&&this.fun==="Histogram.")){
      fill(255,200,200);
    }
    else{fill(250);}
    if(allxbars.length>0||this.always===true){
      stroke(30);
      rect(this.x,this.y,this.w,this.h);
      noStroke();
      fill(10);
      text(this.fun,this.x+.5*this.w,this.y+.5*this.h);
 
    }
  }
  
  tapit(){
    if(mouseX>=this.x&&mouseX<=this.x+this.w&&mouseY>=this.y&&mouseY<=this.y+this.h){
      if(this.fun==="ONE"){
        sampleOne();
        drawHistogram(salaries,500000,[100, 150, 200]);
        decide();
        samplingPanel();
      }
      else if(this.fun==="TEN"){
        for(var y=0;y<10;y++){
          sampleOne();
        }
        drawHistogram(salaries,500000,[100, 150, 200]);
        decide();
        samplingPanel();
      }
      else if(this.fun==="100"){
        for(var y=0;y<100;y++){
          sampleOne();
        }
        drawHistogram(salaries,500000,[100, 150, 200]);
        decide();
        samplingPanel();
      }
      else if(this.fun==="RUN"){
        this.fun="STOP";
        ticker=setInterval(runit,20);
      }
      else if(this.fun==="STOP"){
        drawHistogram(salaries,500000,[100, 150, 200]);
        clearInterval(ticker);
        this.fun="RUN";
        decide();
        samplingPanel();
      }
      else if(this.fun==="Data Values"){
        showingSampleHistogram=false;
        drawHistogram(salaries,500000,[100, 150, 200]);
        decide();
        samplingPanel();
      }
      else if(this.fun==="Histogram"){
        showingSampleHistogram=true;
        drawHistogram(salaries,500000,[100, 150, 200]);
        decide();
        samplingPanel();
      }      
      else if(this.fun==="Dot Plot"&&allxbars.length<5000){
        showingHistogram=false;
        drawHistogram(salaries,500000,[100, 150, 200]);
        decide();
        samplingPanel();
      }
      else if(this.fun==="Histogram."){
        showingHistogram=true;
        drawHistogram(salaries,500000,[100, 150, 200]);
        decide();
        samplingPanel();
      }
    }
  }
  
  
  
  
}
