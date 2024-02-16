export async function postTimerecords(req: any, res: any) {
    try {
        const { db, webSocketConnections } = req.app;
        const { psnr, timestamp } = req.body;

        //Parsen der Parameter
        const parsedTimestamp = new Date(timestamp);
        const parsedpsnr = parseInt(psnr);

        console.log("timestampsperday---POST-Anfrage: " + JSON.stringify(req.body));

        //Überprüfen ob die benötigten Parameter mitgegeben wurde
        if (!parsedpsnr) {
            return res.status(400).json({ message: 'Psnr is required' });
        }
        if (isNaN(parsedTimestamp.getTime())) {
            return res.status(400).json({ message: 'Timestamp format is wrong' });
        }

        //Erstelle ein string date mit dem Datum des Timestamps im YYYY-MM-DD Format
        //year = YYYY
        const year = parsedTimestamp.getFullYear();
        //month = MM
        const month = (parsedTimestamp.getMonth() + 1).toString().padStart(2, '0');
        //day = DD
        const day = parsedTimestamp.getDate().toString().padStart(2, '0');
        //date = YYYY-MM-DD
        const date = `${year}-${month}-${day}`;

        //Ein Dokument von der Datenbank abholen mit der psnr und dem date
        var timerecord = await db.collection('timerecords').findOne({ emppsnr: psnr, date: date });
        //console.log("POST---Timestampsperday: " + JSON.stringify(timestampsperday));

        //Ergebnisbestätigung
        var resultacknowledge = false;

        //Status
        var status = "fehlgeschlagen";

        //Wenn der timerecord für den Tag noch nicht besteht
        if (!timerecord) {
            console.log("POST---Timerecord für diesen Tag noch nicht vorhanden")
            const result = await db.collection('timerecords').insertOne(
                {
                    emppsnr: psnr,
                    date: date,
                    stamps: [
                        {
                            number: 1,
                            type: 'kommt',
                            timestamp: parsedTimestamp
                        }
                    ],
                    workinghours: 0,
                    workingminutes: 0,
                    breakhours: 0,
                    breakminutes: 0

                }
            );
            resultacknowledge = result.acknowledged;
            status = "kommt";
        }
        //Wenn der timerecord für den Tag bereits besteht
        else if (timerecord) {
            console.log("POST---Timerecord ist bereits vorhanden");

            //timestampsarray für den Tag
            const timestampsarray = timerecord.stamps;
            const counter = timestampsarray.length;
            var message: String;

            if (counter % 2 == 0) {
                message = "kommt";
                status = "kommt";
            }
            else if (counter % 2 == 1) {
                message = "geht";
                status = "geht";
            }
            
            const result = await db.collection('timerecords').updateOne(
                {
                    emppsnr: psnr,
                    date: date
                },
                {
                    $push: {
                        stamps: {
                            number: counter + 1,
                            type: message,
                            timestamp: parsedTimestamp
                        }
                    }
                }

            );
            resultacknowledge = result.acknowledged;
        }

        const employee = await db.collection('employees').findOne({psnr: parsedpsnr});

        if (resultacknowledge && employee) {
            const firstname = employee.firstname;
            const lastname = employee.lastname;
            //const hours = parsedTimestamp.getHours().toString().padStart(2, '0');
            //const minutes = parsedTimestamp.getMinutes().toString().padStart(2, '0');
            //const seconds = parsedTimestamp.getSeconds().toString().padStart(2, '0');

            console.log("Message: " + `${firstname} ${lastname} ${status}`);

            webSocketConnections.forEach((ws) => {
                ws.send(`${firstname} ${lastname} ${status}`);
                console.log("websocket---Message gesendet");
            });
            res.status(201).json(`${firstname} ${lastname} ${status}`);
        } else {
            throw new Error('Timestamp not created');
        }
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}
