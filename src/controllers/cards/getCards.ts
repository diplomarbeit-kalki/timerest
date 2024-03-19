import { ObjectId } from "mongodb";

function getDatesBetween(startDateStr: string, endDateStr: string): string[] {
    const startDateParts = startDateStr.split('-').map(part => parseInt(part));
    const endDateParts = endDateStr.split('-').map(part => parseInt(part));

    const startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);
    const endDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);

    const dateArray: string[] = [];
    const currentDate = startDate;

    while (currentDate <= endDate) {
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = String(currentDate.getFullYear());

        dateArray.push(`${day}-${month}-${year}`);

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}

export async function getCountEmployeesWithoutTag(req: any, res: any) {
    try {
        const { db } = req.app;
        const result = await db.collection('employees').find({ tag: null }).toArray();
        res.status(200).json(result.length);
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

export async function getCountTransponders(req: any, res: any) {
    try {
        const { db } = req.app;
        const result = await db.collection('transponders').find({}).toArray();
        res.status(200).json(result.length);
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

export async function getWorkingEmployeesCountFromActualMonth(req: any, res: any) {
    try {
        const { db } = req.app;
        const date = new Date();

        const day = date.getDate();
        const parsedDay = day.toString().padStart(2, '0');
        const month = date.getMonth() + 1;
        const parsedMonth = month.toString().padStart(2, '0');
        const year = date.getFullYear();

        const firstdate = `01-${parsedMonth}-${year}`;
        const lastdate = `${parsedDay}-${parsedMonth}-${year}`;
        const dates = getDatesBetween(firstdate, lastdate);

        const resultPromises = dates.map(async (date) => {
            const count = await db.collection('timerecords').countDocuments({ date: date });
            return { x: date, y: count };
        });

        const result = await Promise.all(resultPromises);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}

export async function getAverageWorkinghoursFromActualMonth(req: any, res: any) {
    try {
        const { db } = req.app;
        const date = new Date();

        const day = date.getDate();
        const parsedDay = day.toString().padStart(2, '0');
        const month = date.getMonth() + 1;
        const parsedMonth = month.toString().padStart(2, '0');
        const year = date.getFullYear();

        const firstdate = `01-${parsedMonth}-${year}`;
        const lastdate = `${parsedDay}-${parsedMonth}-${year}`;
        const dates = getDatesBetween(firstdate, lastdate);

        const resultPromises = dates.map(async (date) => {
            const timerecords = await db.collection('timerecords').find({ date: date }).toArray();
            let totalWorkingMinutes = 0;

            timerecords.forEach((record) => {
                totalWorkingMinutes += parseInt(record.workingminutes);
            });

            const averageWorkingMinutes = timerecords.length > 0 ? totalWorkingMinutes / timerecords.length : 0;
            const averageWorkingHours = averageWorkingMinutes / 60;

            return { x: date, y: averageWorkingHours.toFixed(1) };
        });

        const result = await Promise.all(resultPromises);

        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}
