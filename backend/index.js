const Koa = require('koa');
const Compose = require('koa-compose')
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const multer = require('koa-multer');
const Boom = require('boom');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = new Koa();

app.use(cors());

app.use(async function validationMiddleware(ctx, next) {
    try {
        console.log(`${ctx.method} ${ctx.url}`);
        await next();
    } catch (err) {
        let status;
        let name;
        let message;
        if (Boom.isBoom(err)) {
            status = err.output.statusCode;
            name = err.output.payload.error;
            message = err.output.payload.message; 
        } else if (err.isJoi) {
            ctx.response.status = status = 400;
            name = err.name;
            message = err.details[0].message;
        } else if (err.name && err.name === "TokenExpiredError") {
            ctx.response.status = status = 401;
            name = err.name;
            message = "Authentication Token Expired."
        }
        const error = {
            "meta": {
                "status_code": status,
                "error": name,
                "message": message
            }
        };
        ctx.body = error;
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/audio_files')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending file extension
    }
});

app.use(multer({ storage }).single("file"));
app.use(bodyParser());

const routes = Compose([userRoutes, authRoutes]) 
app.use(routes);

app.listen(4000, () => {
    console.log('Server running at port 4000.');
});