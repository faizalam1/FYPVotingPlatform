import { DefaultAzureCredential } from "@azure/identity";
import ConfidentialLedger, { getLedgerIdentity } from "@azure-rest/confidential-ledger";

export const createLedgerEntry = async (collectionId, data) => {
    const ledgerIdentityCertificate = String(process.env.AZURE_CONFIDENTIAL_LEDGER_TLS)
    console.log(ledgerIdentityCertificate)

    const ledgerURI = process.env.AZURE_CONFIDENTIAL_LEDGER_URI;
    const ledger = new ConfidentialLedger(
        ledgerURI,
        ledgerIdentityCertificate,
        new DefaultAzureCredential()
    );

    const entry = {
        contents: JSON.stringify(data)
    }

    const entryQueryParams = {
        collectionId
    }

    const LedgerEntry = {
        queryParameters: entryQueryParams,
        contentType: "application/json",
        body: entry
    }

    console.log(ledger)
    console.log(LedgerEntry)

    const result = await ledger.path("/app/transactions").post(LedgerEntry);
    console.log(result)
    if (Number(result.status) !== 200) {

        return {
            status: Number(result.status),
            body:result.body
        };
    }
    else {
        return {
            status: 200,
            message: "Ledger entry created successfully",
            transactionId: result.headers["x-ms-ccf-transaction-id"]
        }
    }
}