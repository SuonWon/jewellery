export const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

export const currentDate = new Date().toISOString();

export const apiUrl = "http://localhost:3005/v1";

export const sizeUnit = ["လုံး", "လုံးစီး", "ကိုက်", "မတ်"];

export const moduleName = ["Stone", "Type", "Grade", "Brightness", "Unit", "WalletCategory", "Customer", "Supplier", "Wallet", "StoneSelection", "Share", "Purchase", "Sales", "Issue", "SalesReturn", "PurchaseReturn", "IssueReturn", "Adjustment", "Damage", "SystemUser", "SystemRole", "WalletTransaction", "Payable", "Receivable"];

export function focusSelect(e) {
    e.target.select();
}