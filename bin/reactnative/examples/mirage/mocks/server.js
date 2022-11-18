import {createServer, Model} from "miragejs";

export function makeServer({environment = "test"} = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
    },

    // eslint-disable-next-line no-shadow
    seeds(server) {
      server.create("user", {name: "Bob"});
      server.create("user", {name: "Alice"});
    },

    routes() {
      // This will prefix all routes with /api
      this.namespace = "api";

      // url: /api/users
      this.get("/users", schema => {
        return schema.users.all();
        // or just return a normal object
        // return {users: [{name: 'Bobe'}, {name: 'Alicee'}]};
      });
    },
  });

  return server;
}
