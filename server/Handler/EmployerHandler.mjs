import {pool} from '../Database/database.mjs'
import ExcelJS from 'exceljs'; 

class EmploerHandler{

    static requestStudentData = async (req, res) => {
        const { skill, skillLevel, cgpa, branch, hasSkillCertificate, employerID } = req.body;

        // 1. Validate the input fields
        if (!skill || !skillLevel) {
          return res.status(400).json({ message: "Missing required fields: skill, skillLevel, hasSkillCertificate, employerID" });
        }
        console.log(skillLevel,skill,cgpa,branch,hasSkillCertificate,employerID)
        try {
          // 2. Prepare the query for insertion
          const query = `
            INSERT INTO EmployerRequest (skill, skillLevel, cgpa, branch, hasSkillCertificate, status, employerID) 
            VALUES (?, ?, ?, ?, ?, 'pending', ?)
          `;
    
          // 3. Execute the query using pool
          const result = await pool.query(query, [
            skill.join(','),   // Converting array of skill to a comma-separated string
            skillLevel,
            cgpa || null,       // Optional field, set to null if not provided
            branch.join(','), // Converting array of branch to a comma-separated string
            hasSkillCertificate,
            employerID
          ]);
    
          // 4. Respond with success if the insertion was successful
          return res.status(201).json({ message: "Request submitted successfully", requestID: result.insertId });
        } catch (error) {
          console.error("Error inserting request data:", error);
          return res.status(500).json({ message: "An error occurred while submitting the request" });
        }
      };


      static fetchRequest = async (req, res) => {
        try {
          // Get employerID from request parameters or body (depending on your API design)
          const employerID = req.params.employerID
    
          // Check if employerID exists
          if (!employerID) {
            return res.status(400).json({ message: 'Employer ID is required' });
          }
    
          // Query the database for requests associated with the employerID
          const query = 'SELECT * FROM EmployerRequest WHERE employerID = ?';
          const [results] = await pool.query(query, [employerID]);
    
          // Check if requests exist
          if (results.length === 0) {
            return res.status(404).json({ message: 'No requests found for this employer' });
          }
    
          // Return the requests to the client
         
          res.status(200).json(results);
        } catch (error) {
          // Handle any errors that occur during the request
          console.error('Error fetching employer requests:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      };

      static fetchAllRequest = async (req, res) => {
        try {
            // SQL query to fetch all employer requests
            const query = 'SELECT * FROM EmployerRequest';
            const [rows] = await pool.query(query);
            console.log(rows)
            // Check if data exists
            if (rows.length === 0) {
                return res.status(404).json({ message: 'No employer requests found' });
            }
            
            // Send the fetched data as JSON response
            return res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching employer requests:', error);
            return res.status(500).json({ message: 'Failed to fetch employer requests' });
        }
    };

    static fetchEmployer = async (req, res) => {
      try {
          // SQL query to fetch all employers
          const query = 'SELECT employerID, employerName, employerEmail FROM Employer';
          const [rows] = await pool.query(query);
          
          // Check if there are employers in the database
          if (rows.length === 0) {
              return res.status(404).json({ message: 'No employers found' });
          }

          // Send the fetched employer data as JSON response
          return res.status(200).json(rows);
      } catch (error) {
          console.error('Error fetching employers:', error);
          return res.status(500).json({ message: 'Failed to fetch employers' });
      }
  };

  static updateStatus = async(req,res)=>{
    const { requestID } = req.params;
    const { status } = req.body;

    try {
        const query = 'UPDATE EmployerRequest SET status = ? WHERE employerRequestID = ?';
        await pool.query(query, [status, requestID]);
        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Failed to update status' });
    }
  }

  static downloadStudent = async (req, res) => {
    const { employerRequestID } = req.params;
    try {
      // Step 1: Fetch Employer Request by ID
      const [employerRequest] = await pool.query(
        `SELECT skill, skillLevel, cgpa, branch, status FROM EmployerRequest WHERE employerRequestID = ?`,
        [employerRequestID]
      );
  
      if (!employerRequest || employerRequest.length === 0) {
        return res.status(404).json({ message: 'Employer request not found.' });
      }


  
      const { skill, skillLevel, cgpa, branch,status } = employerRequest[0];
     
      if(status !=="Approved"){
        console.log("here")
        return res.status(403).json({
          message:"Status is pending"
        })
      }
      // Step 2: Handle multiple branches (assume branch is a comma-separated string)
      const branchesArray = branch.split(',');  // Convert branches to array
      const branchPlaceholders = branchesArray.map(() => '?').join(',');  // Prepare SQL placeholders for IN clause
  
      // Prepare the skill criteria and SQL query
      const skillsArray = skill.split(',');
      const skillPlaceholders = skillsArray.map(() => '?').join(',');
  
      const query = `
        SELECT 
          s.\`Name of Student\` as studentName,
          s.\`Personal Email Address\` as emailAddress,
          s.\`Mobile 1\` as mobileNo,
          s.\`Avg. SGPA\` as cgpa,
          s.Branch as branch,
          GROUP_CONCAT(sk.Skill SEPARATOR ', ') as skills
        FROM Student s
        JOIN Skills sk ON s.id = sk.StudentID
        WHERE s.Branch IN (${branchPlaceholders})
          AND s.\`Avg. SGPA\` >= ?
          AND sk.Skill IN (${skillPlaceholders})
          AND sk.Level >= ?
        GROUP BY s.id
        HAVING COUNT(DISTINCT sk.Skill) = ?
      `;
  
      // Step 3: Run query and pass branches and skills as parameters
      const [students] = await pool.query(query, [...branchesArray, cgpa, ...skillsArray, skillLevel, skillsArray.length]);
 
  
      if (students.length === 0) {
        return res.status(404).json({ message: 'No students found matching the criteria.' });
      }
  
      // Step 4: Create an Excel file
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Student List');
  
      // Add column headers
      worksheet.columns = [
        { header: 'Student Name', key: 'studentName', width: 30 },
        { header: 'Email Address', key: 'emailAddress', width: 30 },
        { header: 'Mobile No', key: 'mobileNo', width: 15 },
        { header: 'CGPA', key: 'cgpa', width: 10 },
        { header: 'Branch', key: 'branch', width: 20 },
        { header: 'Skills', key: 'skills', width: 50 },
      ];
  
      // Add student rows
      students.forEach((student) => {
        worksheet.addRow({
          studentName: student.studentName,
          emailAddress: student.emailAddress,
          mobileNo: student.mobileNo,
          cgpa: student.cgpa,
          branch: student.branch,
          skills: student.skills,
        });
      });
  
      // Step 5: Prepare the file for download
      const buffer = await workbook.xlsx.writeBuffer();
  
      res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating Excel file.' });
    }
  };
}


export default EmploerHandler;