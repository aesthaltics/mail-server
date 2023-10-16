import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAILS_DIRECTORY = path.join(__dirname, "..", "mails");


console.log(MAILS_DIRECTORY);

const storeMail = (recipient, readStream) => {
	const inbox_path = path.join(MAILS_DIRECTORY, recipient, "inbox");

	const writeFile = () => {
		const hash = createHash("sha256");
		hash.update(Date.now().toString(10));

		const stream = fs.createWriteStream(
			path.join(inbox_path, hash.digest("hex").concat(".txt"))
		);
		readStream.pipe(stream);

		readStream.on("end", () => {
			hash.end();
		});
	};

	fs.access(inbox_path, (err) => {
		if (err) {
			fs.mkdir(inbox_path, { recursive: true }, (err, path) => {
				writeFile()
			});
		}else{
			writeFile()
		}
	});

	return;
};

export { storeMail };
