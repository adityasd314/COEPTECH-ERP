const {sendMail} = require("../../lib/send_mail");

exports.sendMailLeaveApply = async ({employeeName, managerName, leaveId, startDate, endDate, leaveReason, managerEmail}) => {
    console.log("props : ",employeeName, managerName, leaveId, startDate, endDate, leaveReason, managerEmail );
    const subject = `Request for Leave by ${employeeName}`;

    const mailContent = `<pre>
    Subject: Leave Application Alert for ${employeeName}
    
    Dear ${managerName},
    
    An employee, ${employeeName}, has submitted a leave application for your review and approval.
    
    **Leave Details:**
    - **Employee Name:** ${employeeName}
    - **Leave Id:** ${leaveId}
    - **Start Date:** ${startDate}
    - **End Date:** ${endDate}
    - **Reason:** ${leaveReason}
    
    **Action Required:**
    Please review the leave application by clicking on the following link:
    [Review Leave Request](http://localhost:5173/admin)
    
    **Note:** If you encounter any issues or have questions, please contact the employee directly.
    
    Thank you for your prompt attention to this matter.
    
    Best regards,
    Ara Resources
    </pre>
    `;

    const receivers = []
    receivers.push(managerEmail);

    const response = await sendMail({ subject, receivers, htmlBody: mailContent });
    console.log("Mail sent : ", response);
}

exports.sendMailAcceptedLeave = async ({ employeeName, leaveId, startDate, endDate, leaveReason, employeeEmail }) => {
    const subject = `Leave Application Accepted for ${employeeName}`;

    const mailContent = `<pre>
    Subject: Leave Application Accepted for ${employeeName}
    
    Dear ${employeeName},
    
    Your leave application with the following details has been approved:
    
    **Leave Details:**
    - **Leave Id:** ${leaveId}
    - **Start Date:** ${startDate}
    - **End Date:** ${endDate}
    - **Reason:** ${leaveReason}
    
    You are now granted leave for the specified period.
    
    Thank you for your understanding.
    
    Best regards,
    Ara Resources
    </pre>
    `;

    const receivers = [employeeEmail];

    const response = await sendMail({ subject, receivers, htmlBody: mailContent });
    console.log("Mail sent : ", response);
}

exports.sendMailRejectedLeave = async ({ employeeName, leaveId, startDate, endDate, leaveReason, rejectionReason, employeeEmail }) => {
    const subject = `Leave Application Rejected for ${employeeName}`;

    const mailContent = `<pre>
    Subject: Leave Application Rejected for ${employeeName}
    
    Dear ${employeeName},
    
    Your leave application with the following details has been rejected:
    
    **Leave Details:**
    - **Leave Id:** ${leaveId}
    - **Start Date:** ${startDate}
    - **End Date:** ${endDate}
    - **Reason:** ${leaveReason}
    
    **Rejection Reason:** ${rejectionReason}
    
    Unfortunately, your leave request has been rejected. Please contact your manager for further details.
    
    Thank you for your understanding.
    
    Best regards,
    Ara Resources
    </pre>
    `;

    const receivers = [employeeEmail];

    const response = await sendMail({ subject, receivers, htmlBody: mailContent });
    console.log("Mail sent : ", response);
}