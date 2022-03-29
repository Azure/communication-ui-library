
const disableBetaCi = (branchName) => {
    if(branchName.includes('beta')) {
        return false;
    } else {
        return true;
    }
}