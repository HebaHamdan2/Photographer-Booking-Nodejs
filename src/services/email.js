import nodemailer from "nodemailer";
export async function sendEmail(to,subject,html){
    const transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAILSENDER,
            pass:process.env.PASWORDSENDER,
        },
    });
    const info=await transport.sendMail({
       from:`"Photographer Booking" <${process.env.EMAILSENDER}> `,
       to,
       subject,
       html,
    });
    return info;
}