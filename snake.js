class snake
{
    constructor(x, y, color)
    {
        this.x = x;
        this.y = y;
        this.color = color;

        this.colorTone = 250;

        var canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'c');
        canvas.width = x;
        canvas.height = y;
        canvas.style.position = "absolute";
        canvas.style.border = "thick solid " + colorString(this.colorTone,0,0); //+ color;
        canvas.style.backgroundColor = colorString(0, this.colorTone, 0);//color;
        
        canvas.style.zIndex = 146;

        this.moveMultiplier = 1;
        this.moveX = 0;
        this.moveY = 0;
        this.moveAxis = "x";
        canvas.style.top = 0;
        canvas.style.left = 0;

        document.body.appendChild(canvas);
        this.canvasList = [];

        this.canvasList.push(canvas);

        this.positionMatrix = [];
        for(var i = 0; i < 9; i++)
        {
            this.positionMatrix.push([]);
        }
        for(var i = 0; i < 9; i++)
        {
            for(var j = 0; j < 16; j++)
            {
                this.positionMatrix[i].push(0);
            }
        }
    }

    addPart()
    {
        this.colorTone -= 10;

        var canvas = document.createElement('canvas');
        canvas.width = this.x;
        canvas.height = this.y;
       // canvas.setAttribute('id', 'c1');
        canvas.style.position = "absolute";
        canvas.style.border = "thick solid " + colorString(this.colorTone, 0, 0)// + this.color;
        canvas.style.backgroundColor = colorString(0, this.colorTone, 0);//color;
        
        canvas.style.left = this.canvasList[this.canvasList.length-1].style.left;
        canvas.style.top = this.canvasList[this.canvasList.length-1].style.top;

        canvas.setAttribute("z-index", "-1");

        this.canvasList.push(canvas);
        document.body.appendChild(canvas);
    }

    rotate(direction)//r: right || l: left || u: up || d: down
    {
        if (direction == 'r' && this.moveAxis != "x") 
        {
            this.moveMultiplier = 1;
            this.moveAxis = "x";
        }
        else if (direction == 'l' && this.moveAxis != "x") 
        {
            this.moveMultiplier = -1;
            this.moveAxis = "x";
        }
        else if(direction == 'u' && this.moveAxis != "y") 
        {
            this.moveMultiplier = -1;
            this.moveAxis = "y";
        }
        else if(direction == 'd' && this.moveAxis != "y") 
        {
            this.moveMultiplier = 1;
            this.moveAxis = "y";
        }
    }

    move()
    {
        for(var i = 0; i < this.canvasList.length; i++) //making old positions empty again
        {
            this.positionMatrix[parseInt(this.canvasList[i].style.top) / this.y][parseInt(this.canvasList[i].style.left) / this.x] = 0;
        }


        for(var i = this.canvasList.length-1; i > 0 ; i--)
        {
            this.canvasList[i].style.left = this.canvasList[i-1].style.left;
            this.canvasList[i].style.top = this.canvasList[i-1].style.top;
        }
        
        if(this.moveAxis == "x")
        {
            this.moveX += (this.x * this.moveMultiplier);
            if(this.moveX < 0)
            {
                this.moveX = 16 * this.x;
            }
            else if(this.moveX > 16 * this.x)
            {
                this.moveX = 0;
            }
            this.canvasList[0].style.left = (this.moveX) + "px";
        }
        else if (this.moveAxis == "y")
        {
            this.moveY += (this.y * this.moveMultiplier);
            if(this.moveY < 0)
            {
                this.moveY = 8 * this.x;
            }
            else if(this.moveY > 8 * this.x)
            {
                this.moveY = 0;
            }
            this.canvasList[0].style.top = (this.moveY) + "px";
        }


        for(var i = 0; i < this.canvasList.length; i++) // making new positions full
        {
            this.positionMatrix[parseInt(this.canvasList[i].style.top) / this.y][parseInt(this.canvasList[i].style.left) / this.x] = 1;
        }
    }

    check()
    {
        for(var i = 1; i < this.canvasList.length; i++)
        {
            if ( this.canvasList[0].style.left == this.canvasList[i].style.left && this.canvasList[0].style.top == this.canvasList[i].style.top )
            {
                return 0; //Meaning that it crashed itself || Head is attempted to go throught its body
            }
        }


        var food = document.getElementById("food");
        if(this.canvasList[0].style.left == food.style.left && this.canvasList[0].style.top == food.style.top)
        {
            return 2; // Meaning that head is over the food
        }

        return 1; // No problem found
    }

    createFood() // Gonna use another method for this later || New method to be implemented: Create food once in constructor then just move it when this function is called
    {
        var old = document.getElementById("food");
        var bd = document.body;
        
        if(old != null)
        {
            bd.removeChild(old);
        }


        var xAxis = 15;
        var yAxis = 8;

        var w = 0;
        var h = 0;

        do
        {
            w = randomInt(0, xAxis);
            h = randomInt(0, yAxis);
        }while(this.positionMatrix[h][w] == 1); //Alternative way: Determine all 0 values in the position matrix then pick randomly one of them
        

        var canvas = document.createElement('canvas');
        
        canvas.width = this.x;
        canvas.height = this.y;
        
        canvas.style.position = "absolute";
        canvas.style.border = "thick solid #009999"; //+ this.color;
        canvas.style.backgroundColor = "#009999"//this.color;
        
        canvas.style.left = (w * this.x) + "px";
        canvas.style.top = (h * this.y) + "px";

        canvas.setAttribute('id', 'food');

        document.body.appendChild(canvas);
    }

    reset()
    {
        var bd = document.body;
        while(this.canvasList.length > 1)
        {
            var tmp = this.canvasList.pop();
            bd.removeChild(tmp);
        }

        this.moveMultiplier = 1;
        this.moveX = 0;
        this.moveY = 0;
        this.moveAxis = "x";
        this.canvasList[0].style.top = 0;
        this.canvasList[0].style.left = 0;

        this.positionMatrix = [];
        for(var i = 0; i < 9; i++)
        {
            this.positionMatrix.push([]);
        }
        for(var i = 0; i < 9; i++)
        {
            for(var j = 0; j < 16; j++)
            {
                this.positionMatrix[i].push(0);
            }
        }

        

    }

    resetMatrix()
    {
        for(var i = 0; i < 9; i++)
        {
            for(var j = 0; j < 16; j++)
            {
                this.positionMatrix[i][j] = 0;
            }
        }
    }

}

function randomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function search(lefts, tops, w, h)
{
    for(var i = 0; i < lefts.length; i++)
    {
        if (w == lefts[i] && h == tops[i])
        {
            return true;
        }
    }

    return false;
}

function colorString(r, g, b)
{
    return "rgb(" + r + "," + g + "," + b + ")";
}