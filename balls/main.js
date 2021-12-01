// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

// 生成随机颜色值的函数

function randomColor() {
    const color = 'rgb(' +
        random(0, 255) + ',' +
        random(0, 255) + ',' +
        random(0, 255) + ')';
    return color;
}

// 定义 Ball 构造器

function Shape(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exist = true;
}

function Ball(x, y, velX, velY, color, size) {
    Shape.call(this, x, y, velX, velY)
    this.color = color;
    this.size = size;
}

function EvilCircle(x, y, color,w,a,s,d) {
    Shape.call(this, x, y, 20, 20)
    this.color = color;
    this.size = 10;
    this.w = w;
    this.a = a;
    this.s = s;
    this.d = d;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

EvilCircle.prototype = Object.create(Shape.prototype)
EvilCircle.prototype.constructor = EvilCircle

// 定义彩球绘制函数

Ball.prototype.draw = function () {
    if (this.exist) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();        
    }
};

EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
};

// 定义彩球更新函数

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
};

EvilCircle.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.x -=(this.size);
    }

    if ((this.x - this.size) <= 0) {
        this.x +=(this.size);
    }

    if ((this.y + this.size) >= height) {
        this.y -=(this.size);
    }

    if ((this.y - this.size) <= 0) {
        this.y +=(this.size);
    }
};

// 定义碰撞检测函数

Ball.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (this !== balls[j]) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = randomColor();
            }
        }
    }
};

EvilCircle.prototype.eat = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exist) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exist = false;
            }
        }
    }
};

EvilCircle.prototype.setControls = function () {
    window.onkeydown = e => {
        switch(e.key) {
          case this.a:
            this.x -= this.velX;
            break;
          case this.d:
            this.x += this.velX;
            break;
          case this.w:
            this.y -= this.velY;
            break;
          case this.s:
            this.y += this.velY;
            break;
        }
    };
}

// 定义一个数组，生成并保存所有的球

let balls = [];

while (balls.length < 25) {
    const size = random(10, 20);
    let ball = new Ball(
        // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomColor(),
        size
    );
    balls.push(ball);
}

evil_1 = new EvilCircle(20, 20, 'white', 'w', 'a', 's', 'd')
evil_1.setControls()
// 定义一个循环来不停地播放

function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }

    evil_1.draw();
    evil_1.update();
    evil_1.eat();

    requestAnimationFrame(loop);
}

loop();