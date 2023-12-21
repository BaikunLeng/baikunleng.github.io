---
layout: archive
title: ""
permalink: /Quiz/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<h1>Know Me Better by Taking This Quiz!</h1>

<p>
Life isn't always black and white, but in my quiz, it is! Gear up for a series of binary choices that will unveil just how much we vibe together. If you are 100% with me, <strong> shoot me an email</strong> we should grab a coffee at some point! 
</p>
<p></p>

<p>
Acknowledgement: This idea was inspired by Muyan Jiang, a Ph.D. student at Berkeley.
</p>


<hr/>
<div class="row">
    <div class="col-sm-4">
        <img class="img-responsive" src="https://cdn.cnn.com/cnnnext/dam/assets/180426115546-cola-wars-coke-pepsi.jpg" width="25%"/>
    </div>

    <div class="col-sm-8">
        <p>
        Question 1: Pepsi or Coke?
        </p>
        <button onclick="photo1()">Pepsi</button>
        <div id="answer1" style="display:none;">
            Pepsi, something tastes like toilet cleaner.
        </div>
        <button onclick="photo2()">Coke</button>
        <div id="answer2" style="display:none;">
            Yes, coke please.
        </div>
        <script>
            function photo1() {
              var x = document.getElementById("answer1");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
        <script>
            function photo2() {
              var x = document.getElementById("answer2");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-sm-4">
        <img class="img-responsive" src="/images/KC.jpg" width="25%"/>

    </div>

    <div class="col-sm-8">
        <p>
        Question 2: Kyrie or Stephen?
        </p>
        <button onclick="Kyrie()">Kyrie</button>
        <div id="Kyrie" style="display:none;">
            Hélà. Let's Go!! Uncle Drew!
        </div>
        <button onclick="Stephen()">Stephen</button>
        <div id="Stephen" style="display:none;">
            NIGHT NIGHT
        </div>
        <script>
            function Kyrie() {
              var x = document.getElementById("Kyrie");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
        <script>
            function Stephen() {
              var x = document.getElementById("Stephen");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-sm-4">
         <img class="img-responsive" src="/images/DK.jpg" width="25%"/>
    </div>

    <div class="col-sm-8">
        <p>
        Question 3: Drake or Kanye?
        </p>
        <button onclick="Drake()">Drake</button>
        <div id="Drake" style="display:none;">
            Albums are too commercial to be great.
        </div>
        <button onclick="Kanye()">Kanye</button>
        <div id="Kanye" style="display:none;">
            The Real Artist of All Time!!!
        </div>
        <script>
          function Drake() {
              var x = document.getElementById("Drake");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
        <script>
            function Kanye() {
              var x = document.getElementById("Kanye");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-sm-4">
        <img class="img-responsive" src="https://cdn.britannica.com/86/166986-050-4CEFE5DE/cute-kitten-and-puppy-outdoors-in-grass.jpg" width="25%"/>
    </div>

    <div class="col-sm-8">
        <p>
        Question 4: Dog or cat?
        </p>
        <button onclick="Dog()">Dog</button>
        <div id="Dog" style="display:none;">
            Yes! I love dogs!
        </div>
        <button onclick="Cat()">Cat</button>
        <div id="Cat" style="display:none;">
            Yes! I love cats too!
        </div>
        <script>
            function Dog() {
              var x = document.getElementById("Dog");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
        <script>
            function Cat() {
              var x = document.getElementById("Cat");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-sm-4">
        <img class="img-responsive" src="/images/stfcal.jpg" width="25%"/>
    </div>
    <div class="col-sm-8">
      
      <p>
        Question 5: Stanford or Berkeley?
        </p>
          <button onclick="Stanford()">Stanford</button>
        <div id="Stanford" style="display:none;">
            Bruh?! Are You Serious?
        </div>
        <button onclick="Berkeley()">Berkeley</button>
        <div id="Berkeley" style="display:none;">
            I love Berkeley... But GO BRUINS!!!
        </div>
        <script>
            function Stanford() {
              var x = document.getElementById("Stanford");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
        <script>
            function Berkeley() {
              var x = document.getElementById("Berkeley");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-sm-4">
        <img class="img-responsive" src="/images/EI.jpg" width="25%"/>
    </div>
    <div class="col-sm-8">
        
      <p>
        Question 6: Extroverted or Introverted?
        </p>
        <button onclick="Extroverted()">Extroverted</button>
        <div id="Extroverted" style="display:none;">
           One hundred percent.
        </div>
        <button onclick="Introverted()">Introverted</button>
        <div id="Introverted" style="display:none;">
            NO WAY.
        </div>
        <script>
            function Extroverted() {
              var x = document.getElementById("Extroverted");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
        <script>
            function Introverted() {
              var x = document.getElementById("Introverted");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-sm-4">
      <img class="img-responsive" src="/images/FamilyGuy.jpg" width="25%"/>
    </div>

    <div class="col-sm-8">
        <p>
        Question 7: The Simpsons or Family Guy?
        </p>
        <button onclick=" The Simpsons()"> The Simpsons</button>
        <div id=" The Simpsons" style="display:none;">
            Never Watch it.
        </div>
        <button onclick="Family Guy()">Family Guy</button>
        <div id="Family Guy" style="display:none;">
            Unga Bunga! Unga Bunga!! Unga Bunga!!!
        </div>
        <script>
            function The Simpsons() {
              var x = document.getElementById("The Simpsons");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
        <script>
            function Family Guy() {
              var x = document.getElementById("Family Guy");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
    </div>
</div>
<hr/>
<div class="row">
    <div class="col-sm-4">
        <img class="img-responsive" src="https://a4.espncdn.com/combiner/i?img=%2Fphoto%2F2022%2F1120%2Fr1093637_1296x729_16%2D9.jpg" width="25%"/>
    </div>
    <div class="col-sm-8">
       
      <p>
        Last Question: Now the most important question. Who is the GOAT?
        </p>
        <button onclick="photo7()">Messi</button>
        <div id="answer7" style="display:none;">
            Messi is the only GOAT.
        </div>
        <button onclick="photo8()">Ronaldo</button>
        <div id="answer8" style="display:none;">
            Siuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
        </div>
        <script>
            function photo7() {
              var x = document.getElementById("answer7");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
        <script>
            function photo8() {
              var x = document.getElementById("answer8");
              if (x.style.display === "none") {
                x.style.display = "block";
              } else {
                x.style.display = "none";
              }
            }
        </script>
    </div>
</div>
<hr/>

