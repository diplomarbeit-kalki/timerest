function calculateTimeDifference(time1: string, time2: string): number {
    const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
    const [hours2, minutes2, seconds2] = time2.split(":").map(Number);
    
    const totalMinutes1 = hours1 * 60 + minutes1 + seconds1 / 60;
    const totalMinutes2 = hours2 * 60 + minutes2 + seconds2 / 60;

    return Math.abs(totalMinutes1 - totalMinutes2);
}

export async function postTimerecord(req: any, res: any) {
    try {
        const { db, webSocketConnections } = req.app;
        const { psnr, date, timestamp } = req.body;

        const parsedpsnr = parseInt(psnr);
        const [day, month, year] = date.split("-");
        const [hours, minutes, seconds] = timestamp.split(":");
    
        if (!parsedpsnr) {
            return res.status(400).json({ message: 'Psnr is required' });
        }
        if (!hours) {
            return res.status(400).json({ message: 'Timestamp format wrong' });
        }
        if (!minutes) {
            return res.status(400).json({ message: 'Timestamp format wrong' });
        }
        if (!seconds) {
            return res.status(400).json({ message: 'Timestamp format wrong' });
        }
        if (!day) {
            return res.status(400).json({ message: 'Date format wrong' });
        }
        if (!month) {
            return res.status(400).json({ message: 'Date format wrong' });
        }
        if (!year) {
            return res.status(400).json({ message: 'Date format wrong' });
        }

        //Ein Dokument von der Datenbank abholen mit der psnr und dem date
        var timerecord = await db.collection('timerecords').findOne({ emppsnr: parsedpsnr, date: date });
        const employee = await db.collection('employees').findOne({ psnr: parsedpsnr });
        if (!employee) {
            webSocketConnections.forEach((ws) => {
                ws.send(JSON.stringify({ message: `Personalnummer nicht vorhanden!` }));
                console.log("websocket---Personalnummer nicht vorhanden!---gesendet");
            });
            throw new Error('Personalnummer nicht vorhanden!');
        }

        //Ergebnisbestätigung
        var resultacknowledge = false;

        //Status
        var status = "fehlgeschlagen";

        //Wenn der timerecord für den Tag noch nicht besteht
        if (!timerecord && employee) {
            console.log("POST---Timerecord für diesen Tag wird angelegt")
            const result = await db.collection('timerecords').insertOne(
                {
                    emppsnr: parsedpsnr,
                    date: date,
                    stamps: [
                        {
                            number: 1,
                            type: 'kommt',
                            timestamp: timestamp
                        }
                    ],
                    workingtime: "00:00",
                    workingminutes: 0,
                    breaktime: "00:00",
                    breakminutes: 0
                }
            );
            resultacknowledge = result.acknowledged;
            status = "kommt";
        }
        //Wenn der timerecord für den Tag bereits besteht
        else if (timerecord && employee) {
            console.log("POST---Timerecord ist bereits vorhanden");

            //timestampsarray für den Tag
            const timestamps = timerecord.stamps;
            const timestampsCounter = timestamps.length;
            var message: String;

            if (timestampsCounter % 2 == 0) {
                message = "kommt";
                status = "kommt";
            }
            else if (timestampsCounter % 2 == 1) {
                message = "geht";
                status = "geht";
            }

            const result = await db.collection('timerecords').updateOne(
                {
                    emppsnr: parsedpsnr,
                    date: date
                },
                {
                    $push: {
                        stamps: {
                            number: timestampsCounter + 1,
                            type: message,
                            timestamp: timestamp
                        }
                    }
                }

            );
            resultacknowledge = result.acknowledged;
        }
        if (resultacknowledge && employee) {
            const firstname = employee.firstname;
            const lastname = employee.lastname;
            const profilepicture = employee.profilepicture;
            console.log("Message: " + `${firstname} ${lastname} ${status}`);

            //Websocket Nachricht senden
            webSocketConnections.forEach((ws) => {
                ws.send(JSON.stringify({ psnr: `${parsedpsnr}`, message: `${firstname} ${lastname} ${status}`, profilepicture: profilepicture}));
                console.log("websocket---Message---gesendet");
            });

            //Die Arbeits- und Pausendzeit aktualisieren
            //Aktuelles Dokument fetchen
            var actualtimerecord = await db.collection('timerecords').findOne({ emppsnr: parsedpsnr, date: date });
            const actualtimestamps = actualtimerecord.stamps;

            //Variable für die gesamte Arbeits- und Pausenzeit
            var totalworktime = 0;
            var totalbreaktime = 0;

            //Jedes Element ausgeben
            for (let i = 0; i < actualtimestamps.length; i++) {
                if (actualtimestamps[i].number > 1 && actualtimestamps[i].number % 2 == 0) {
                    const timediff = calculateTimeDifference(actualtimestamps[i - 1].timestamp, actualtimestamps[i].timestamp);
                    totalworktime += timediff;
                    //console.log(`Stempelnumer ${actualtimestamps[i - 1].number}-${actualtimestamps[i].number}, Arbeitszeit:  ${timediff}`);
                }
                if (actualtimestamps[i].number > 1 && actualtimestamps[i].number % 2 == 1) {
                    const timediff = calculateTimeDifference(actualtimestamps[i - 1].timestamp, actualtimestamps[i].timestamp);
                    totalbreaktime += timediff;
                    //console.log(`Stempelnumer ${actualtimestamps[i - 1].number}-${actualtimestamps[i].number}, Pausenzeit:  ${timediff}`);
                }
            };

            const totalWorkHours = Math.floor(totalworktime / 60).toString().padStart(2, '0');
            const totalWorkMinutes = (totalworktime % 60).toString().padStart(2, '0');
            const totalBreakHours = Math.floor(totalbreaktime / 60).toString().padStart(2, '0');
            const totalBreakMinutes = (totalbreaktime % 60).toString().padStart(2, '0');

            const result = await db.collection('timerecords').updateOne(
                {
                    emppsnr: parsedpsnr,
                    date: date
                },
                {
                    $set: {
                        workingtime: `${totalWorkHours}:${totalWorkMinutes}`,
                        workingminutes: totalworktime,
                        breaktime: `${totalBreakHours}:${totalBreakMinutes}`,
                        breakminutes: totalbreaktime
                    }
                }
            );
            if (result.acknowledged) {
                console.log("Erfolgreich Zeiten aktualisiert");
            }
            else {
                throw new Error('Abreits- und Pausenzeiten nicht aktualisiert');
            }

            //HTTP-Response senden
            res.status(201).json(`${firstname} ${lastname} ${status}`);
        }
        else {
            throw new Error('Timestamp creation failed');
        }
    }
    catch (error) {
        console.log(error.toString());
        res.status(500).json(error.toString());
    }
}
