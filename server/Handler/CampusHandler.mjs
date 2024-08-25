import Database from '../Database/database.mjs'
import { pool } from '../Database/database.mjs'
import xlsx from 'xlsx'
import { BRANCHS } from '../Utils/constant.mjs'
import sendNotification from '../Utils/notification.mjs'
class CampusHandler {

    static CDB = new Database(
        "Campus",
        ['CampusName', 'Message', 'package', 'Location', 'Date']
    )

    static RDB = new Database(
        "Round",
        ['CampusID', 'RoundName', 'RoundDate']
    )

    static ADB = new Database(
        'Attendances',
        ['StudentID', 'RoundID', 'AttendanceStatus', 'AttendanceDate']
    )

    static SDB = new Database(
        'Student',
        ['id', 'College ID']
    )

    static create = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
    
            const { campusName, Message, pack, Location, rounds } = req.body;
            const buffer = req.file.buffer;
            const workbook = xlsx.read(buffer, { type: 'buffer' });
            const sheet_name_list = workbook.SheetNames;
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            const collegeIds = data.map(row => row["College ID"]);
    
            // Check if the campus with the same name exists
            const [existingCampuses] = await CampusHandler.CDB.read('`CampusName` = ?', [campusName]);
    
            if (existingCampuses) {
                console.log(existingCampuses);
                return res.status(409).json({ message: 'Campus with the same name already exists' });
            }
    
            // Create the campus
            const campusID = await CampusHandler.CDB.create('(?, ?, ?, ?,?)', [campusName, Message, pack, Location, rounds[0].roundDate]);
    
            // Check for existing students
            const a = collegeIds.map(() => '?').join(',');
            const condition = `\`College ID\` IN (${a})`;
            const students = await CampusHandler.SDB.read(condition, collegeIds);
            const studentIdMap = students.reduce((acc, student) => {
                acc[student['College ID']] = student.id;
                return acc;
            }, {});
    
            // Create the rounds and attendance for the first round
            let firstRoundProcessed = false;
            const notificationPromises = [];
    
            for (const round of rounds) {
                const roundID = await CampusHandler.RDB.create('(?, ?, ?)', [campusID, round.roundName, round.roundDate]);
    
                if (!firstRoundProcessed) {
                    for (const row of data) {
                        const collegeId = row["College ID"];
                        const studentID = studentIdMap[collegeId];
                        if (studentID) {
                            const existingAttendance = await CampusHandler.ADB.read('`StudentID` = ? AND `RoundID` = ?', [studentID, roundID]);
                            if (existingAttendance.length === 0) {
                                await CampusHandler.ADB.create('(?, ?, ?, ?)', [studentID, roundID, 'Absent', round.roundDate]);
    
                                // Fetch the FCM token for the student
                                
                                const [s] = await pool.query('SELECT FCMToken FROM Student WHERE id = ?', [studentID]);
                                const fcmToken = s[0]?.FCMToken;  // Adjust based on the actual column name in your database
    
                                if (fcmToken) {
                                    const payload = {
                                        notification: {
                                            title: `${campusName} arrived`,
                                            body: `Be ready for ${round.roundName} round`,
                                        },
                                        data: {
                                            screen_id: `404`,
                                            screen: '/campus',   
                                          },
                                    };
    
                                    // Add the notification promise to the list
                                    notificationPromises.push(sendNotification(fcmToken, payload));
                                }
                            }
                        }
                    }
                    firstRoundProcessed = true;
                }
            }
    
            // Wait for all notifications to be sent
         Promise.all(notificationPromises);
    
            res.status(200).json({ message: 'Campus created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating campus', error });
        }
    };


    static read = async (req, res) => {
        try {
            // Fetch all campuses
            const campuses = await this.CDB.read();
            if (campuses.length === 0) {
            
                return res.status(404).json({ message: 'No campuses found' });
            }
           
            // Iterate over each campus to fetch rounds and attendance details
            const campusDataPromises = campuses.map(async (campus) => {
                // Fetch rounds for the current campus
                const rounds = await this.RDB.read('`CampusID` = ?', [campus.CampusID]);

                // Fetch attendance details for each round
                const roundDataPromises = rounds.map(async (round) => {
                    const attendances = await this.ADB.read('`RoundID` = ?', [round.RoundID]);

                    // Count present and absent students
                    const presentCount = attendances.filter(record => record.AttendanceStatus === 'Present').length;
                    const absentCount = attendances.filter(record => record.AttendanceStatus === 'Absent').length;

                    return {
                        roundID: round.RoundID,
                        roundName: round.RoundName,
                        roundDate: round.RoundDate,
                        presentCount,
                        absentCount
                    };
                });

                const roundData = await Promise.all(roundDataPromises);


                return {
                    campusID: campus.CampusID,
                    campusName: campus.CampusName,
                    package: campus.package,
                    date: campus.Date,
                    rounds: roundData
                };
            });
           
            const campusData = await Promise.all(campusDataPromises);
           console.log(campusData)
            res.status(200).json(campusData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching campus details', error });
        }
    };


    static getCampusDetails = async (req, res) => {
        try {
            const { campusID } = req.params;
            const [campus] = await CampusHandler.CDB.read('`CampusID` = ?', [campusID]);
            if (!campus) {
                return res.status(404).json({ message: 'Campus not found' });
            }

            const rounds = await CampusHandler.RDB.read('`CampusID` = ?', [campusID]);

            res.status(200).json({ campus, rounds });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching campus details', error });
        }
    };


    static update = async (req, res) => {
        try {
            const { campusID } = req.params;
            console.log(req.body)
            const { campusName, Message, pack, Location } = req.body;
            console.log('Received campusID:', campusID);
            console.log('Received campusName:', campusName);
            console.log('Received Message:', Message);
            console.log('Received pack:', pack);
            console.log('Received Location:', Location);
            // Check if the campus with the same name exists
            const [existingCampuses] = await CampusHandler.CDB.read('`CampusName` = ? AND `CampusID` != ?', [campusName, campusID]);

            if (existingCampuses) {
                return res.status(409).json({ message: 'Campus with the same name already exists' });
            }

            const query = `
            UPDATE \`Campus\`
            SET \`CampusName\` = ?, \`Message\` = ?, \`package\` = ?, \`Location\` = ?
            WHERE \`CampusID\` = ?`;
            const values = [campusName, Message, pack, Location, campusID];

            const [result] = await pool.query(query, values);


            res.status(200).json({ message: 'Campus updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating campus', error });
        }
    };



    static readRound = async (req, res) => {
        try {
            const { roundID } = req.params;

            const attendanceData = [];

            // Fetch round and campus details
            const roundQuery = `
                SELECT r.RoundID, r.RoundName, r.RoundDate, c.CampusID, c.CampusName, c.Date AS CampusDate
                FROM Round r
                INNER JOIN Campus c ON r.CampusID = c.CampusID
                WHERE r.RoundID = ?
            `;
            const roundResult = await pool.query(roundQuery, [roundID]);
            const roundDetails = roundResult[0];

            for (const branch of BRANCHS) {
                let query;
                if (branch === 'ALL') {
                    query = `
                        SELECT
                            COUNT(*) AS total,
                            SUM(CASE WHEN AttendanceStatus = 'Present' THEN 1 ELSE 0 END) AS present,
                            SUM(CASE WHEN AttendanceStatus = 'Absent' THEN 1 ELSE 0 END) AS absent
                        FROM Attendances
                        WHERE RoundID = ?
                    `;
                } else {
                    query = `
                        SELECT
                            COUNT(*) AS total,
                            SUM(CASE WHEN a.AttendanceStatus = 'Present' THEN 1 ELSE 0 END) AS present,
                            SUM(CASE WHEN a.AttendanceStatus = 'Absent' THEN 1 ELSE 0 END) AS absent
                        FROM Attendances a
                        INNER JOIN Student s ON a.StudentID = s.id
                        WHERE s.Branch = ? AND a.RoundID = ?
                    `;
                }

                const result = await pool.query(query, branch === 'ALL' ? [roundID] : [branch, roundID]);
                attendanceData.push({ branch, ...result[0] });
            }

            res.json({ success: true, data: { round: roundDetails, attendance: attendanceData } });
        } catch (error) {
            console.error("Error fetching attendance:", error);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }


    static readAllRound = async (req, res) => {
        try {
            const { campusID } = req.params;

            const query = `
                SELECT * 
                FROM Round
                WHERE CampusID = ?
            `;

            const [rounds] = await pool.query(query, [campusID]);
            console.log(rounds)
            res.json({ success: true, data: rounds });
        } catch (error) {
            console.error("Error fetching rounds:", error);
            res.status(500).json({ success: false, error: "Internal server error" });
        }
    }

    static updateRound = async (req, res) => {
        try {
            const { roundID, roundName, roundDate } = req.body;
            const file = req.file;
           
            if (!roundID || !roundName || !roundDate) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const updateQuery = `
                UPDATE Round
                SET RoundName = ?, RoundDate = ?
                WHERE RoundID = ?;
            `;
            const values = [roundName, roundDate, roundID];
            const result = await pool.query(updateQuery, values);

            if (result.rowCount === 0) {
                return res.status(404).json({ message: "Round not found" });
            }

            if (file) {
                const buffer = req.file.buffer;
                const workbook = xlsx.read(buffer, { type: 'buffer' });
                const sheet_name_list = workbook.SheetNames;
                const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
                const collegeIds = data.map(row => row["College ID"]);
                const a = collegeIds.map(() => '?').join(',');
                const condition = `\`College ID\` IN (${a})`;
                const students = await CampusHandler.SDB.read(condition, collegeIds);
                const studentIdMap = students.reduce((acc, student) => {
                    acc[student['College ID']] = student.id;
                    return acc;
                }, {});
             
                for (const row of data) {
                  
                    const collegeId = row["College ID"];
                    const studentID = studentIdMap[collegeId];
                    if (studentID) {
                        const existingAttendance = await CampusHandler.ADB.read('`StudentID` = ? AND `RoundID` = ?', [studentID, roundID]);
                        if (existingAttendance.length === 0) {
                            await CampusHandler.ADB.create('(?, ?, ?, ?)', [studentID, roundID, 'Absent', roundDate]);

                            const [s] = await pool.query('SELECT FCMToken FROM Student WHERE id = ?', [studentID]);
                            const fcmToken = s[0]?.FCMToken;  // Adjust based on the actual column name in your database

                            if (fcmToken) {
                            
                                const payload = {
                                    notification: {
                                        title: `Next Round!!`,
                                        body: `Be ready for ${roundName} round`,
                                    },
                                    data: {
                                        screen_id: `${roundID}`,
                                        screen: '/campus',   
                                      },
                                };

                                // Add the notification promise to the list
                            
                               sendNotification(fcmToken, payload);
                                
                            }

                        }
                    }
                }
               


            }


            res.status(200).json({
                message: "Round updated successfully",
            });
        } catch (error) {
            console.error('Error updating round:', error);
            res.status(500).json({ message: "An error occurred while updating the round" });
        }
    }

    static addRound = async (req, res) => {
       
        const { campusID, roundName, date } = req.body;
       
        if (!campusID || !roundName || !date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            const [result] = await pool.query(
                'INSERT INTO Round (CampusID, RoundName, RoundDate) VALUES (?, ?, ?)',
                [campusID, roundName, date]
            );

            return res.status(201).json({ message: "Round created successfully", roundID: result.insertId });
        } catch (error) {
            console.error('Error adding round:', error);
            return res.status(500).json({ message: "An error occurred while creating the round" });
        }
    };


    static getCampusList = async (req, res) => {
        try {
           
            // Query to fetch campus ID and campus name
            const query = 'SELECT CampusID AS id, CampusName AS name FROM Campus';
            
            // Execute the query
            const [rows] = await pool.execute(query);

            // Check if any campuses were found
            if (rows.length > 0) {
                // Return the list of campuses with a success status code
                res.status(200).json({ campuses: rows });
            } else {
                console.log("campusnot found")
                res.status(404).json({
                    
                    message: 'No campuses found' });
            }
        } catch (error) {
            // Log the error and return a server error status code
            console.error('Error fetching campus list:', error);
            res.status(500).json({ message: 'An error occurred while fetching campus data' });
        }
    }



}

export default CampusHandler;
