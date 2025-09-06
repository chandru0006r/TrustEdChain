import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const StudentMicroloan = await ethers.getContractFactory("StudentMicroloan");

  const contract = await StudentMicroloan.deploy();
  console.log("StudentMicroloan deploying...");

  await contract.waitForDeployment();

  console.log("StudentMicroloan deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
