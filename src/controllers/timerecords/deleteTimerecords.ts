import { ObjectId } from "mongodb";

function calculateTimeDifference(time1: string, time2: string): number {
    const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
    const [hours2, minutes2, seconds2] = time2.split(":").map(Number);

    const totalMinutes1 = hours1 * 60 + minutes1 + seconds1 / 60;
    const totalMinutes2 = hours2 * 60 + minutes2 + seconds2 / 60;

    return Math.abs(totalMinutes1 - totalMinutes2);
}

export async function deleteTimerecordTimestamp(req: any, res: any) {
    try {
        const { db } = req.app;
        const { id, number } = req.query;

        const parsedId = new ObjectId(id);
        const parsedNumber = parseInt(number);
        console.log("DelteTimerecords...");
        console.log(`Id: ${id}, Number: ${number}`);

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }
        if (!number) {
            return res.status(400).json({ message: 'Number is required' });
        }

        const result = await db.collection('timerecords').updateOne(
            { "_id": parsedId },
            { $pull: { "stamps": { "number": parsedNumber } } }
        )
        if (!result.acknowledged || result.modifiedCount < 1) {
            res.status(400).json({ message: `Timestamp mit number ${number} existiert nicht` });
        }

        const timerecord = await db.collection('timerecords').findOne({ _id: parsedId });
        //console.log("timerecord: " + JSON.stringify(timerecord));

        const timestamps = timerecord.stamps;
        //console.log("timestamps: " + JSON.stringify(timestamps));

        let typeToggle = true;
        const updatedTimestamps = timestamps.map((stamp, index) => {
            stamp.number = index + 1; // Neuzuweisung der Number, beginnend mit 1
            stamp.type = typeToggle ? "kommt" : "geht"; // Alternierender Typ
            typeToggle = !typeToggle; // Umschalten für das nächste Element
            return stamp;
        });
        //console.log("updatedTimestamps: " + JSON.stringify(updatedTimestamps));

        const result2 = await db.collection('timerecords').updateOne(
            { "_id": parsedId },
            { $set: { "stamps": updatedTimestamps } }
        );
        //console.log("Result2: " + JSON.stringify(result2));
        if (!result2.acknowledged) {
            res.status(400).json({ message: `Timestamp update fields  fehlgeschlagen` });
        }

        //Die Arbeits- und Pausendzeit aktualisieren
        //Aktuelles Dokument fetchen
        var actualtimerecord = await db.collection('timerecords').findOne({ _id: parsedId });
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
        //console.log(`Totalworktime = ${totalworktime} und Totalbreaktime = ${totalbreaktime}`);

        const totalWorkHours = Math.floor(totalworktime / 60).toString().padStart(2, '0');
        const totalWorkMinutes = (totalworktime % 60).toString().padStart(2, '0');
        const totalBreakHours = Math.floor(totalbreaktime / 60).toString().padStart(2, '0');
        const totalBreakMinutes = (totalbreaktime % 60).toString().padStart(2, '0');
        //console.log("totalWorkHours: " + totalWorkHours);
        //console.log("totalWorkMinutes: " + totalWorkMinutes);
        //console.log("totalBreakHours: " + totalBreakHours);
        //console.log("totalBreakMinutes: " + totalBreakMinutes);

        const result3 = await db.collection('timerecords').updateOne(
            {
                _id: parsedId
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
        if (!result3.acknowledged) {
            res.status(400).json({ message: `Timestamp update statistic fields  fehlgeschlagen` });
        }
        else {
            res.status(200).json(`Timerecord timestamp gelöscht und Felder aktualisiert`);
        }
    }
    catch (error) {
        console.log(error.toString());
        res.status(500).json(error.toString());
    }
}