export async function postTimestampperdayWithPsnr(req: any, res: any) {
    try {
        const { db, webSocketConnections } = req.app;
        const { psnr, timestamp } = req.body;

        const parsedTimestamp = new Date(timestamp);
        const parsedpsnr = parseInt(psnr);

        console.log("timestampsperday---POST-Anfrage: " + JSON.stringify(req.body));

        if (!parsedpsnr) {
            return res.status(400).json({ message: 'Psnr is required' });
        }
        if (isNaN(parsedTimestamp.getTime())) {
            return res.status(400).json({ message: 'Timestamp format is wrong' });
        }

        //Erstelle ein string date mit dem Datum des Timestamps im YYYY-MM-DD Format
        const year = parsedTimestamp.getFullYear();
        const month = (parsedTimestamp.getMonth() + 1).toString().padStart(2, '0');
        const day = parsedTimestamp.getDate().toString().padStart(2, '0');
        const date = `${year}-${month}-${day}`;

        //Testausgaben für die parsedpsnr und das date
        //console.log("POST---psnr: " + typeof parsedpsnr + " " + parsedpsnr);
        //console.log("POST---date: " + typeof date + " " + date);

        //Ein Dokument von der Datenbank abholen mit der psnr und dem date
        var timestampsperday = await db.collection('timestampsperday').findOne({ emppsnr: psnr, date: date });
        //console.log("POST---Timestampsperday: " + JSON.stringify(timestampsperday));

        var resultacknowledged = false;
        var status = "fehlgeschlagen";

        if (!timestampsperday) {
            console.log("POST---Timestampsperday noch nicht vorhanden")
            const result = await db.collection('timestampsperday').insertOne(
                {
                    emppsnr: psnr,
                    date: date,
                    timestamps: [
                        {
                            type: 'kommt',
                            time: parsedTimestamp
                        }
                    ]
                }
            );
            resultacknowledged = result.acknowledged;
            status = "kommt";
        }
        else if (timestampsperday) {
            const timestampsarray = timestampsperday.timestamps;

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
            const result = await db.collection('timestampsperday').updateOne(
                {
                    emppsnr: psnr,
                    date: date
                },
                {
                    $push: {
                        timestamps: {
                            type: message,
                            time: parsedTimestamp
                        }
                    }
                }

            );
            resultacknowledged = result.acknowledged;
        }
        if (resultacknowledged) {
            const hours = parsedTimestamp.getHours().toString().padStart(2, '0');
            const minutes = parsedTimestamp.getMinutes().toString().padStart(2, '0');
            const wsmessage = `Mitarbeiter ${psnr} ${status}, Uhrzeit: ${hours}:${minutes}`;
            webSocketConnections.forEach((ws) => {
                ws.send(wsmessage);
                console.log("websocket---Message gesendet");
            });
            res.status(200).json(
                {
                    message: 'Timestamp created',
                    psnr: psnr,
                    timestamp: timestamp,
                    status: status
                }
            );
        } else {
            throw new Error('Timestamp not created');
        }
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}
