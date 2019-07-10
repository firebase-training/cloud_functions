import { estimateBirthYear } from '../shared/birthyear';
import { localFunction } from '../shared/functions';
import { migrateAgetoBirthdayRequest, migrateAgetoBirthdayWithTransactionRequest } from './migrate-requests';

export const estimateBirthday = localFunction.firestore.document('users/{userId}').onUpdate((change, context) => {
    console.log("Estimate birthyear for document", context.params.userId);

    // Retrieve the current and previous value
    const data = change.after.data();
    const previousData = change.before.data();

    // We'll only update if the name has changed.
    // This is crucial to prevent infinite loops.
    if (!data || !previousData || !data.age || data.age === previousData.age) {
        return null;
    }

    // Then return a promise of a set operation to update the count
    return change.after.ref.update({
        birthyear: estimateBirthYear(data.age)
    });
});

export const migrateAgetoBirthday = localFunction.https.onRequest(migrateAgetoBirthdayRequest);

export const migrateAgetoBirthdayWithTransaction = localFunction.https.onRequest(migrateAgetoBirthdayWithTransactionRequest);