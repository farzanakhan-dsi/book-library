const Hapi = require("hapi");
const Mongoose = require("mongoose");


const server = new Hapi.Server({ "host": "localhost", "port": 3000 });

Mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log(`Error in DB connection : ${err}`)}
});

//Model definition
const PersonModel = Mongoose.model("person", {
    firstname: String,
    lastname: String
});

//Home Route

//Home route
server.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => {
        return "Home Route";
    }
});

server.route({
    method: "POST",
    path: "/person",
    handler: async (request, h) => {
        try {
            var person = new PersonModel(request.payload);
            var result = await person.save();
            return h.response(result);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
});

server.route({
    method: "GET",
    path: "/people",
    handler: async (request, h) => {
        try {
            var person = await PersonModel.find().exec();
            return h.response(person);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
});

server.route({
    method: "GET",
    path: "/person/{id}",
    handler: async (request, h) => {
        try {
            var person = await PersonModel.findById(request.params.id).exec();
            return h.response(person);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
});

server.route({
    method: "PUT",
    path: "/person/{id}",
    handler: async (request, h) => {
        try {
            var result = await PersonModel.findByIdAndUpdate(request.params.id, request.payload, { new: true });
            return h.response(result);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
});

server.route({
    method: "DELETE",
    path: "/person/{id}",
    handler: async (request, h) => {
        try {
            var result = await PersonModel.findByIdAndDelete(request.params.id);
            return h.response(result);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
});

server.start();