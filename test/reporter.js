import { Transform } from "node:stream";

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    if (event.type === "test:stderr") {
      callback(null, event.data.message);
    } else {
      callback(null, "");
    }
  },
});

export default customReporter;
