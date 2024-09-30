import { pool } from '../Database/database.mjs'

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







}



export default StatsHandler