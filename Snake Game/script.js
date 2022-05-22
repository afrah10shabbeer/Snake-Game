function init()
{
	canvas = document.getElementById('myCanvas');
	w = canvas.width = 3000;
	h = canvas.height = 2300;
	cs = 160;
	gameOver = false;
	pen = canvas.getContext('2d');
	score = 3;
	scoreX = 100;
	scoreY = 120;
	myFood = getRandomFood();

	/* Using Apple image instead of drawing Apple from scratch
	appleImg = new Image();
	appleImg.src = 'apple.png';*/

	trophy = new Image();
	trophy.src = 'trophy.png';

	snake = {

		init_len:3,
		color:"#00ff00",
		cells:[],
		direction:"right",
		
		createSnake:function()
		{
			for(var i = this.init_len;i > 0 ;i--)
			{
				this.cells.push({x:i,y:0});
			}
		},
		drawSnake:function()
		{
			pen.lineWidth = 5;
			pen.strokeStyle = 'black';
			pen.fillStyle = this.color;

			for(var i = 0;i < this.cells.length;i++)
			{
				pen.save();

				pen.shadowOffsetX = 3;
				pen.shadowOffsetY = 15;
				pen.shadowColor = '#000033';
				pen.shadowBlur = 4.2;
				pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-2,cs-2);
		
				pen.restore();
				pen.strokeRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-2,cs-2);
			}
		},
		updateSnake:function()
		{
			console.log("Update snake according to the direction property")
			var headX = this.cells[0].x;
			var headY = this.cells[0].y;
			
			//food doesn't display over the snake, but food is considered as eaten even though the snake passes from the side
			/*if((headX == myFood.x + 1 && headY == myFood.y) || (headX == myFood.x && headY == myFood.y + 1)
				|| (headX == myFood.x && headY == myFood.y - 1) || (headX == myFood.x - 1 && headY == myFood.y)
				)*/

			//food gets displayed over the snake, ans food is considered as eaten iff the snake crosses the food	
			if(headX == myFood.x && headY == myFood.y)
			{
				console.log("Food eaten");
				myFood = getRandomFood();
				var pos = {x:myFood.x,y:myFood.y};
				
				//Checking the coordinates of single and double digit score on 'trophy' image
				score++;
				if(score < 10)
				{
					scoreX = 100;
					scoreY = 120;
				}
				else
				{
					scoreX = 85;
					scoreY = 120;
				}
			}
			else
			{
				//Removing the last cell from snake
				this.cells.pop();
			}

			var nextX,nextY;
			if(this.direction == "right")
			{
				nextX = headX + 1;
				nextY = headY;

				//If snake goes out of bounds to right side, then snake comes again from left side
				if(nextX * cs > w)
				{
					nextX = 0;
				}
			}
			else if(this.direction == "left")
			{
				nextX = headX - 1;
				nextY = headY;

				//If snake goes out of bounds to left side, then snake comes again from right side
				if(nextX < 0)
				{
					nextX = Math.floor(w/cs);
				}
			}
			else if(this.direction == "down")
			{
				nextX = headX;
				nextY = headY + 1;

				//If snake goes out of bounds to lower, then snake comes again from upper side
				if(nextY * cs > h)
				{
					nextY = 0;
				}
			}
			else
			{
				nextX = headX;
				nextY = headY - 1

				//If snake goes out of bounds to upper side, then snake comes again from lower side
				if(nextY < 0)
				{
					nextY = Math.floor(h/cs);
				}
			}

			/*Condition to end the game
			1)If the snake bites  itself, then the game is over
			2)If the snake length becomes equal to total number of cells on the board, then the game is over,
			 this case will be handled automatically by case 1*/
			for(let i = 0;i < this.cells.length;i++)
			{
				if((this.cells[i].x == nextX) && (this.cells[i].y == nextY))
				{
					gameOver = true;
					return;
				}
			}

			//Inserting the cell at front of snake
			this.cells.unshift({x:nextX,y:nextY});	
		}
		
	};
	snake.createSnake();

	//Add keyboard movements to the snake/Event listener to the document object
	function keyPressed(e)
	{
		if(e.key == "ArrowRight")
		{
			snake.direction = "right";
		}
		else if(e.key == "ArrowLeft")
		{
			snake.direction = "left";
		}
		else if(e.key == "ArrowDown")
		{
			snake.direction = "down";
		}
		else
		{
			snake.direction = "up";
		}
		console.log(snake.direction);
		
	}
	document.addEventListener('keydown',keyPressed);
}

function draw()
{
	//Erase the old screen
	pen.clearRect(0,0,w,h);
	
	//Draw snake
	snake.drawSnake();
	//Draw Food at random place
	myFood.drawFood();

	//Draw trophy
	pen.save();

	pen.shadowOffsetX = 3;
	pen.shadowOffsetY = 15;
	pen.shadowColor = 'black';
	pen.shadowBlur = 4.2;
	pen.drawImage(trophy,20,30,cs + 40,cs + 40);

	pen.restore();

	//Draw score
	pen.fillStyle = "black";
	pen.font = "bold 60px Helvetica";
	pen.fillText(score,scoreX,scoreY);
}
function update()
{
	snake.updateSnake();
}
function getRandomFood()
{
	//Get Random (x,y) coordinates for food
	var foodX = Math.round(Math.random() * (w - cs)/cs);
	var foodY = Math.round(Math.random() * (h - cs)/cs);

	var food = {
		x:foodX,
		y:foodY,
		foodColor:'#da350b',
		branchColor:'#805500',
		leafColor:'#38e000',

		//function to draw Red Apple from SCRATCH
		drawFood:function()
		{

			var currX = food.x*cs;
			var currY = food.y*cs;

			//drawing apple
			pen.save();

			pen.beginPath();
			pen.shadowOffsetX = 3;
			pen.shadowOffsetY = 15;
			pen.shadowColor = '#000033';
			pen.shadowBlur = 4.2;
			pen.arc(currX + 80,currY + 80,70,0,Math.PI*2,true);

			//pen.drawImage(appleImg,myFood.x*cs,myFood.y*cs,cs,cs + 40);

			pen.fillStyle = food.foodColor;
			pen.fill();

			//drawing leaf
			pen.beginPath();
			pen.strokeStyle = food.leafColor;
			pen.lineWidth = 4;
			pen.arc(currX + 95,currY + 10,30,4.1,5.9,false);
			pen.fillStyle = food.leafColor;
			pen.fill();

			pen.restore();

			
			//drawing inner glow on apple
			pen.beginPath();
			pen.moveTo(currX + 40,currY + 40);
			pen.ellipse(currX + 50,currY + 43,13,20,Math.PI/4,0,2 * Math.PI);
			pen.fillStyle = '#db6161';
			pen.fill();
			

			//drawing branch of the apple
			pen.beginPath();
			pen.strokeStyle = food.branchColor;
			pen.moveTo(currX + 75,currY + 5);
			pen.lineWidth = 10;
			pen.lineCap = 'round';
			pen.lineTo(currX + 75,currY - 20);
			pen.stroke();
		}
	} 
	return food;
}
function gameLoop()
{
	if(gameOver == true)
	{
		clearInterval(myTime);
		alert("Game Over!");
	}
	draw();
	update();
}
init();

var myTime = setInterval(gameLoop,100);
