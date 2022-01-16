/* Getting canvas element and context from it */

const canvas = document.getElementById('canvas')

const ctx = canvas.getContext('2d');

/* Getting Audio */

const sound = new Audio('../sounds/ping.wav')


const foreColor = '#0ff'

/* Drawing Elements */

const paddle = {
	
	  width: 10,
	  height: 100
	
}

const net = {
	
	  x: (canvas.width/2) - 5,
	  y: 0,
	  width: 10,
	  height: canvas.height,
	  color: '#f00'
	
}

const user = {
	
	  x: canvas.width - (paddle.width + 10),
	  y: canvas.height / 2 - paddle.height/2,
	  width: paddle.width,
	  height: paddle.height,
	  code: 'user',
	  score: 0
	
}

const ai = {
	
	   x: (paddle.width + 10),
	  y: canvas.height / 2 - paddle.height/2,
	  width: paddle.width,
	  height: paddle.height,
	  code: 'ai',
	  diff: 0.03,
	  score: 0
	
}

const ball = {
	
	  x: canvas.width / 2,
	  y: canvas.height / 2,
	  radius: 15,
	  speed: 7,
	  velocityX: 5,
	  velocityY: 5,
	  color: '#ff0'
	
}

/* Drawing Elements Ends */

let upArrowPressed = false;
let downArrowPressed = false; 


setInterval(gameLoop, 1000 / 60) // 60 frames per second

// The game loop

function gameLoop(){
	
	update();
	render();
		
}

/* Updates the game */

function update(){
	
	  
	if(upArrowPressed && user.y > 0){
		
		   user.y -= 50;   // if up arrow is pressed, move up
 		 
	} else if(downArrowPressed && (user.y < canvas.height - user.height)){
		
		  user.y += 50;   // if down arrow is pressed, move down
		
	}
	 
	  // --> resets to default.
	  
   upArrowPressed = false;
		downArrowPressed = false;
  	 

  // --> moving the ball
 
  	ball.x += ball.velocityX
  	ball.y += ball.velocityY
	
	 // --> making ball bounce when it hits the horizontal walls
	
	if(ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) ball.velocityY = -ball.velocityY;
	
	// --> if the ball hits right wall then ai scored one
	
	if(ball.x + ball.radius >= canvas.width){
		
		   ai.score++;
		   reset();
		
	}
	
	// --> if the ball hits left wall then user scored
	
	if(ball.x + ball.radius <= 0){
		
		   user.score++;
		   reset();
		
	}
	
	
	 // --> checking if the ball hit any one of the paddles
	
	 let player = (ball.x < canvas.width / 2) ? ai : user; 

	
	if(collisionDetect(player, ball)){
		
		// --> plays sound
		sound.play();
		
  let angle = 0;
		
		if (ball.y < (player.y + player.height / 2)) { 
		
		angle = -1 * Math.PI / 4; 
		
		} else if (ball.y > (player.y + player.height / 2)) {
		
			  angle = Math.PI / 4;
			  
			} 
		
		ball.velocityX = (player.code == 'ai' ? 1 : -1) * ball.speed * Math.cos(angle); 
		
		ball.velocityY = ball.speed * Math.sin(angle); 

  ball.speed += 0.2
		
		
	} 
	
	// --> increasing difficulty by user's score
	
	ai.diff = Math.floor(user.score % 10) * 0.02 || ai.diff;
	
	ai.y += ((ball.y - (ai.y + ai.height / 2))) * ai.diff;
	
}


/* reset function */
function reset(){
	
	  ball.x = canvas.width / 2
	  ball.y = canvas.height / 2
	  ball.speed = 7
	  
	  ball.velocityX = -ball.velocityX
	  ball.velocityY = -ball.velocityY

	
}

/* function to check if the ball hits the player's paddle */

function collisionDetect(player, orb){
	
	  player.top = player.y
	  player.right = player.x + player.width
	  player.bottom = player.y + player.height
	  player.left = player.x
	  
	  orb.top = orb.y - orb.radius
	  orb.right = orb.x + orb.radius
	  orb.bottom = orb.y + orb.radius
	  orb.left = orb.x - orb.radius
	  
	  return orb.left < player.right && orb.top < player.bottom && orb.right > player.left && orb.bottom > player.top; 
	  
	
	
}

/* Renders Canvas */

function render(){
	
	   ctx.fillStyle = '#000'
	   ctx.fillRect(0, 0, canvas.width, canvas.height) // the black background
	  
	  drawNet()
	  
	  drawPaddle(user.x, user.y , user.width, user.height)

drawPaddle(ai.x, ai.y , ai.width, ai.height)

 drawBall(ball.x, ball.y, ball.radius, ball.color);
 
 drawScore(canvas.width / 4, canvas.height / 7, ai.score )

 drawScore(3 * canvas.width / 4, canvas.height / 7, user.score)
	
}

/* Drawing Functions */

function drawNet(){
	
	  ctx.fillStyle = net.color
	  ctx.fillRect(net.x, net.y, net.width, net.height)
	
}

function drawPaddle(x, y, width, height){
	
	   ctx.fillStyle = foreColor
	   ctx.fillRect(x, y, width, height)
	
	
}


function drawBall(x, y, radius, color){
	
	   ctx.fillStyle = color;
	   ctx.beginPath();
	   ctx.arc(x, y, radius, 0, Math.PI * 2, true)
	   ctx.closePath();
	   ctx.fill();
}


function drawScore(x, y, score, color){
	
	  ctx.fillStyle = color;
	  
	  ctx.font = '40px Sans-Serif'
	
	  ctx.fillText(score, x, y)
}


/* Drawing Functions ends */

// --> handler functions

function keyUpHandler(){
	
	  upArrowPressed = (upArrowPressed)? false: true;	
	  
	  
	
}

function keyDownHandler(){
	
	
	   downArrowPressed = (downArrowPressed)? false: true;
	   
	   
	
}

// events

window.onkeydown = function(key){
	
	 key = key || window.event;
	 
	 if(key.keyCode == '38'){
	 	
	 	  upArrowPressed = true
	 	
	 } else if(key.keyCode == '40'){
	 	
	 	  downArrowPressed = true
	 	
	 }
	  
	  
	 return;
	
	
}

window.onkeyup = function(key){
	
	 key = key || window.event;
	 
	 if(key.keyCode == '38'){
	 	
	 	  upArrowPressed = false
	 	
	 } else if(key.keyCode == '40'){
	 	
	 	  downArrowPressed = false
	 	
	 }
	  
	  
	 return;
	
	
}



