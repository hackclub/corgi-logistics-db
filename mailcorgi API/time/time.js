now = Date.now();

time = new Date(now);
future = new Date(now + 900000);

console.log(time.toISOString(), future.toISOString());
console.log(time.toString(), future.toString());

console.log(future == time);

