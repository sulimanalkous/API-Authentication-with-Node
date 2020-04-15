const app = require('./app')
// Start the Server
const port = process.env.PORT || 3000
app.listen(port)

console.log(`Server listening at ${port}`)