const { sendMail } = require("../../lib/send_mail");

exports.sendMailLeaveCancel = async ({ employeeName, managerName, leaveId, startDate, endDate, leaveReason, managerEmail }) => {
    console.log("Sending leave cancellation email to:", managerEmail);
    console.log("Email details:", {
        employeeName,
        managerName,
        leaveId,
        startDate,
        endDate,
        leaveReason,
        managerEmail
    });

    const subject = `Leave Cancellation by ${employeeName}`;

    const mailContent = `<pre>
    Subject: Leave Cancelation by ${employeeName}
    
    Dear ${managerName},
    
    An employee, ${employeeName}, has cancelled a leave.
    
    **Leave Details:**
    - **Employee Name:** ${employeeName}
    - **Leave Id:** ${leaveId}
    - **Start Date:** ${startDate}
    - **End Date:** ${endDate}
    - **Reason:** ${leaveReason}
    
    **Action Required:**
    As the employee, ${employeeName}, has canceled their leave, 
    we kindly request your attention to manage the attendance records, 
    particularly if the leave date is today. Your prompt action in updating the attendance records is highly appreciated
    
    **Note:** If you encounter any issues or have questions, please contact the employee directly.
    
    Thank you for your prompt attention to this matter.
    
    Best regards,
    Ara Resources
    </pre>
    `;

    const receivers = [managerEmail];

    try {
        console.log("Sending leave cancellation email...");
        const response = await sendMail({ subject, receivers, htmlBody: mailContent });
        console.log("Mail sent successfully. Response:", response);
    } catch (error) {
        console.error("Error sending leave cancellation email:", error.message);
    }
};
