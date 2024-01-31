export const pause = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
};

export const currentDate = new Date().toISOString();

export const apiUrl = "http://localhost:3005/v1";

export const sizeUnit = ["လုံး", "လုံးစီး", "ကိုက်", "မတ်"];

// *** Note:: don't change index. If you want to add, you can add at the end of array.
export const moduleName = [
    "Stone", // 0
    "Type", // 1
    "Grade", // 2
    "Brightness", // 3 
    "Unit", // 4
    "WalletCategory", // 5 
    "Customer", // 6
    "Supplier", // 7
    "Wallet", // 8
    "StoneSelection", // 9
    "Share", // 10
    "Purchase", // 11
    "Sales", // 12
    "Issue", // 13
    "SalesReturn", // 14
    "PurchaseReturn", // 15
    "IssueReturn", // 16
    "Adjustment", // 17
    "Damage", // 18
    "SystemUser", // 19
    "SystemRole", // 20
    "WalletTransaction", // 21
    "Payable", // 22
    "Receivable", // 23
    "Dashboard" // 24
];



export function focusSelect(e) {
    e.target.select();
}


// export const moduleName = [
//     "Stone", // 0
//     "Type", // 1
//     "Grade", // 2
//     "Brightness", // 3 
//     "Unit", // 4
//     "WalletCategory", // 5 
//     "Customer", // 6
//     "Supplier", // 7
//     "Wallet", // 8
//     "StoneSelection", // 9
//     "Share", // 10
//     "Purchase", // 11
//     "Sales", // 12
//     "Issue", // 13
//     "SalesReturn", // 14
//     "PurchaseReturn", // 15
//     "IssueReturn", // 16
//     "Adjustment", // 17
//     "Damage", // 18
//     "SystemUser", // 19
//     "SystemRole", // 20
//     "WalletTransaction", // 21
//     "Payable", // 22
//     "Receivable" // 23
// ];