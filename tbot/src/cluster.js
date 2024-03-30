const cluster = require("node:cluster");
const { availableParallelism } = require("node:os");

const numCPUs = availableParallelism();

console.log("Primary cluster pid", process.pid);

cluster.setupPrimary({
    exec: __dirname + "/index.js"
})

// Fork workers.
for (let i = 0; i < numCPUs; i++) {
    createWorker();
};

function createWorker() {
    const worker = cluster.fork();
    console.log(`Worker process ${worker.process.pid} started`);

    worker.on("exit", (code) => {
        console.log(`worker ${worker.process.pid} exited with code ${code}`)
        createWorker();
    });
};