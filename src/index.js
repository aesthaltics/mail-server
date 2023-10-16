import { SMTPServer } from "smtp-server";
import { storeMail } from "./handleMail.js";

const PORT = 2525;
const mailServer = new SMTPServer({
	banner: "Hello, pleased to meet you!",
	name:"mail-server",
	authOptional:true,
	logger: true,
	onData(stream, session, callback) {
		session.envelope.rcptTo.forEach(async (recipient) => {
			return storeMail(recipient.address, stream);
		});
		callback();
	},
});

mailServer.listen(PORT);
