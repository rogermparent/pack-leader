export default function calculatePackages(
    itemCount,
    nestSettings,
    currentSettingIndex = 0,
    currentResult = [],
    lastFullPackParts = 1,
    lastPartialPackParts
) {
    if(currentSettingIndex >= nestSettings.length) return currentResult;
    const currentSetting = nestSettings[currentSettingIndex];

    const fullPackageCount = Math.trunc(itemCount/currentSetting.amount);
    const remainder = itemCount % currentSetting.amount;
    const partsPerFullPack = lastFullPackParts * currentSetting.amount;
    const packageVariants = [];

    if(remainder > 0) {
        // There will be a partial pack

        // Add full packages to the results
        if(fullPackageCount > 0) {
            packageVariants.push({
                amount: fullPackageCount,
                partCount: partsPerFullPack,
            });
        }

        // Find the amount of parts in the last package
        const lastPackParts = lastPartialPackParts ?
              ((remainder-1)*lastFullPackParts)+lastPartialPackParts :
              remainder * lastFullPackParts;

        // Add the partial package to the results separately
        packageVariants.push({
            amount: 1,
            partCount: lastPackParts
        });

        currentResult.push({
            name: currentSetting.name,
            variants: packageVariants
        });

        return calculatePackages(
            fullPackageCount+1,
            nestSettings,
            currentSettingIndex+1,
            currentResult,
            partsPerFullPack,
            lastPackParts
        );
    } else {
        // There are no direct partial packages
        if(lastPartialPackParts){
            // A partial exists in the child packages
            // Add the full packages, if they exist
            if(fullPackageCount > 1) {
                packageVariants.push({
                    amount: fullPackageCount - 1,
                    partCount: partsPerFullPack
                });
            }

            // Add the partial package
            // Find the amount of parts in the last package
            const lastPackParts = ((currentSetting.amount-1)*lastFullPackParts)
                  + lastPartialPackParts;

            packageVariants.push({
                amount: 1,
                partCount: lastPackParts
            });

            currentResult.push({
                name: currentSetting.name,
                variants: packageVariants
            });

            return calculatePackages(
                fullPackageCount,
                nestSettings,
                currentSettingIndex+1,
                currentResult,
                partsPerFullPack,
                lastPackParts
            );

        } else {

            // All packages will be full
            packageVariants.push({
                name: currentSetting.name,
                amount: fullPackageCount,
                partCount: partsPerFullPack
            });

            currentResult.push({
                name: currentSetting.name,
                variants: packageVariants
            });

            return calculatePackages(
                fullPackageCount,
                nestSettings,
                currentSettingIndex+1,
                currentResult,
                partsPerFullPack
            );
        }
    }
}
