import { pool } from '../Database/database.mjs'
import xlsx from 'xlsx'

class StatsHandler {
    static statData = async (req, res) => {
        try {
            const totalCampusQuery = "SELECT COUNT(*) AS totalCampus FROM Campus;";
            const totalOngoingCampusQuery = "SELECT COUNT(*) AS totalOngoingCampus FROM Campus WHERE status = 'Pending';";
            const totalStudentsQuery = "SELECT COUNT(*) AS totalStudents FROM Student;";
            const totalPlacedStudentsQuery = `
                SELECT COUNT(DISTINCT p.StudentID) AS totalPlacedStudents 
                FROM Placement p;
            `;
            const recentOngoingCampusQuery = `
                SELECT * 
                FROM Campus 
                WHERE status = 'Pending' 
                ORDER BY Date DESC 
                LIMIT 3;
            `;
            const recentCompletedCampusQuery = `
                SELECT * 
                FROM Campus 
                WHERE status = 'Complated' 
                ORDER BY Date DESC 
                LIMIT 3;
            `;
            const recentEmployerRequestQuery = `
                SELECT * 
                FROM Employer 
                where status = "Pending"
                ORDER BY employerID DESC 
                LIMIT 3;
            `;
            const recentJobEmployerRequestQuery = `
    SELECT
        e.employerName,
        er.skill,
        er.skillLevel,
        COUNT(j.jobId) AS jobCount
    FROM 
        EmployerRequest er
    JOIN 
        Employer e ON er.employerID = e.employerID
    LEFT JOIN 
        Jobs j ON er.employerRequestID = j.employerRequestID
    GROUP BY 
        er.employerRequestID, e.employerName, er.skill, er.skillLevel
    ORDER BY 
        er.employerRequestID DESC 
    LIMIT 3;
`;


            const [totalCampus] = await pool.query(totalCampusQuery);
            const [totalOngoingCampus] = await pool.query(totalOngoingCampusQuery);
            const [totalStudents] = await pool.query(totalStudentsQuery);
            const [totalPlacedStudents] = await pool.query(totalPlacedStudentsQuery);
            const [recentOngoingCampus] = await pool.query(recentOngoingCampusQuery);
            const [recentCompletedCampus] = await pool.query(recentCompletedCampusQuery);
            const [recentEmployerRequest] = await pool.query(recentEmployerRequestQuery);
            const [recentJobEmployerRequest] = await pool.query(recentJobEmployerRequestQuery);
            console.log(recentJobEmployerRequest)

            res.json({
                totalCampus: totalCampus[0]?.totalCampus,
                totalOngoingCampus: totalOngoingCampus[0]?.totalOngoingCampus,
                totalStudents: totalStudents[0]?.totalStudents,
                totalPlacedStudents: totalPlacedStudents[0]?.totalPlacedStudents,
                recentOngoingCampus,
                recentCompletedCampus,
                recentEmployerRequest,
                recentJobEmployerRequest
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching statistics", error });
        }
    };

    static branchWisePlacement = async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    s.Branch, 
                    COUNT(DISTINCT s.id) AS totalStudents,  -- Unique count of students from Student table
                    COUNT(DISTINCT p.StudentID) AS placedStudents  -- Unique count of placed students
                FROM 
                    Student s 
                LEFT JOIN 
                    Placement p ON s.id = p.StudentID 
                GROUP BY 
                    s.Branch 
                ORDER BY 
                    s.Branch ASC
            `);


            // Map the results to include 'Pending' and a 'Download' link
            const result = rows.map(row => ({
                Branch: row.Branch,
                'Total Students': row.totalStudents, // Total unique students in the branch
                'Placed Students': row.placedStudents, // Unique students who have been placed
                'Pending': row.totalStudents - row.placedStudents, // Students still pending placement
                'Download': `/api/admin/download/placement-report/${encodeURIComponent(row.Branch)}` // Download link
            }));
           
            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching branch-wise placement:', error);
            res.status(500).json({ message: 'Error fetching branch-wise placement', error: error.message });
        }
    };

    static branchWisePlacementDownload = async (req, res) => {
        try {
            const branchName = req.params.branchName; // Assuming the branch name is sent as a URL parameter
            console.log(branchName)
            // Check if branchName exists
            if (!branchName) {
                return res.status(400).json({ message: 'Branch name is required' });
            }
    
            const query = `
            SELECT 
                s.id AS studentRegNo,
                s.\`Name of Student\` AS studentName,
                c.CampusName AS companyName
            FROM 
                Student s
            JOIN 
                Placement p ON s.id = p.StudentID
            JOIN 
                Campus c ON p.CampusID = c.CampusID
            WHERE 
                s.Branch = ? AND c.status = 'Complated';
            `;
            
            const [students] = await pool.query(query, [branchName]);
            console.log(students)
            // Check if there are any placed students from that branch
            if (students.length === 0) {
                return res.status(404).json({ message: 'No placed students found for this branch' });
            }
           
            // Create a new workbook and add the students' data to a worksheet
            const workbook = xlsx.utils.book_new();
            const worksheetData = [
                ['Registration No', 'Name of Student', 'Company Name'], // Header Row
                ...students.map(student => [student.studentRegNo, student.studentName, student.companyName])
            ];
            const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Placed Students');
            console.log(worksheet)
            // Generate buffer and send as a response
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
            
            // Set response headers for file download
            res.setHeader('Content-Disposition', 'attachment; filename=placed_students.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            
            // Send the Excel file as a response
            res.send(excelBuffer);
        } catch (error) {
            console.error('Error generating Excel file:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
    


    static complateCampus = async (req, res) => {
        try {
            const [rows] = await pool.query(`
            SELECT 
            CampusID AS campusId,
                CampusName AS name,
                DATE_FORMAT(Date, '%b %d, %Y') AS dates,
                eligibleStudents,
                placedStudents,
                eligibleStudents - placedStudents AS pending
               
            FROM 
                Campus 
            WHERE 
                status = 'Complated'
        `);

            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching completed campus:', error);
            res.status(500).json({ message: 'Error fetching completed campus', error: error.message });
        }
    };

    static campusStats = async (req, res) => {
        const { campusId } = req.params; // Get campusId from request params
        try {
            const [rows] = await pool.query(`
                SELECT 
                    s.Branch,
                    COUNT(s.id) AS 'Total Students',
                    COUNT(p.StudentID) AS 'Placed Students',
                    COUNT(s.id) - COUNT(p.StudentID) AS 'Pending',
                    CONCAT('/download/student-report/', s.Branch) AS Download
                FROM 
                    Student s
                LEFT JOIN 
                    Placement p ON s.id = p.StudentID
                WHERE 
                    p.CampusID = ?
                GROUP BY 
                    s.Branch
            `, [campusId]);

            res.status(200).json(rows);
        } catch (error) {
            console.error('Error fetching branch-wise placement data:', error);
            res.status(500).json({ message: 'Error fetching branch-wise placement data', error: error.message });
        }
    };


    static campusBranchWiseDownload = async (req, res) => {
        try {
            const { branchName, campusId } = req.params; // Assuming branch name and campus ID are sent as URL parameters
        
            // Validate input
            if (!branchName || !campusId) {
                return res.status(400).json({ message: 'Branch name and campus ID are required' });
            }
    
            // SQL query to fetch placed students for the specified branch and campus
            const query = `
                SELECT 
                    s.id AS studentRegNo,
                    s.\`Name of Student\` AS studentName,
                    c.CampusName AS companyName
                FROM 
                    Student s
                JOIN 
                    Placement p ON s.id = p.StudentID
                JOIN 
                    Campus c ON p.CampusID = c.CampusID
                WHERE 
                    s.Branch = ? AND c.CampusID = ? AND c.status = 'Complated';
            `;
    
            const [students] = await pool.query(query, [branchName, campusId]);
    
            // Check if there are any placed students
            if (students.length === 0) {
                return res.status(404).json({ message: 'No placed students found for this branch and campus' });
            }
    
            // Create a new workbook and add the students' data to a worksheet
            const workbook = xlsx.utils.book_new();
            const worksheetData = [
                ['Registration No', 'Name of Student', 'Company Name'], // Header Row
                ...students.map(student => [student.studentRegNo, student.studentName, student.companyName])
            ];
            const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Placed Students');
    
            // Generate buffer and send as a response
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
            
            // Set response headers for file download
            res.setHeader('Content-Disposition', 'attachment; filename=placed_students.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            
            // Send the Excel file as a response
            res.send(excelBuffer);
        } catch (error) {
            console.error('Error generating Excel file:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };






}



export default StatsHandler