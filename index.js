/* Libraries */
import express from 'express';

/* Controllers */
import processCycle from './src/api/list/controller.js'
import healthCheck from './src/api/health/controller.js';

/* Express app Setup */
const app = express();
app.use(express.json())

/* Routes */
app.post('/process-cycle', processCycle)
app.get('/', healthCheck);

app.use((req, res) => {
    res.status(404);
    res.json({ status: 'fail', error: 'Not found' });
});

/* Server setup */
const server = app.listen(8081, () => {
   const host = '127.0.0.1';
   const port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);
});

export default app;