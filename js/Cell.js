class Cell {
   constructor(numberOfCells, gameBoardEl, numberOfColumns) {
      this.numberOfCells = numberOfCells;
      this.allCells = [];
      this.numberOfColumns = numberOfColumns;
      this.gameBoardEl = gameBoardEl;
      this.mineIndexes = [];
      this.isEnd = false;
      this.indexesCellsNextToMine = [];
   }

   disableAllCells() {
      this.allCells.forEach((cell) => {
         cell.style.pointerEvents = "none";
      });
   }

   showCell(cell) {
      cell.classList.remove("border--concave");
      cell.classList.add("border--revealed");
   }

   handleCellClick(e) {
      const clickedCell = e.target;
      const clickedIndex = Number(clickedCell.id);
      this.showCell(clickedCell);
      if (this.mineIndexes.includes(clickedIndex)) this.isEnd = true;
      this.showNumber(clickedIndex);
   }
   createCells() {
      document.documentElement.style.setProperty(
         "--cells-in-row",
         this.numberOfColumns
      );
      for (let i = 0; i < this.numberOfCells; i++) {
         const cell = document.createElement("div");
         cell.className = "cell border border--concave";
         cell.id = i;
         cell.addEventListener("click", (e) => this.handleCellClick(e));
         this.allCells.push(cell);
         this.gameBoardEl.appendChild(cell);
      }
   }

   getNeighborIndexes(index) {
      const neighborIndexes = [];
      let startColumn, endColumn;
      if (index % this.numberOfColumns === 0) {
         startColumn = 0;
         endColumn = 1;
      } else if (index % this.numberOfColumns === this.numberOfColumns - 1) {
         startColumn = -1;
         endColumn = 0;
      } else {
         startColumn = -1;
         endColumn = 1;
      }
      const isIndexOnTheBoard = (index) => {
         return (
            index >= 0 &&
            index <= this.numberOfCells - 1 &&
            !this.mineIndexes.includes(index)
         );
      };
      for (startColumn; startColumn <= endColumn; startColumn++) {
         const firstNumber = index + startColumn;
         const secondNumber = index + startColumn - this.numberOfColumns;
         const thirdNumber = index + startColumn + this.numberOfColumns;

         if (startColumn !== 0 && isIndexOnTheBoard(firstNumber))
            neighborIndexes.push(firstNumber);
         if (isIndexOnTheBoard(secondNumber))
            neighborIndexes.push(secondNumber);
         if (isIndexOnTheBoard(thirdNumber)) neighborIndexes.push(thirdNumber);
      }
      return neighborIndexes;
   }

   pushIndexesNearBomb() {
      this.mineIndexes.forEach((mineIndex) =>
         this.getNeighborIndexes(mineIndex).forEach((neighbor) =>
            this.indexesCellsNextToMine.push(neighbor)
         )
      );

      this.indexesCellsNextToMine = this.indexesCellsNextToMine.filter(
         (index) =>
            index >= 0 &&
            index <= this.numberOfCells - 1 &&
            !this.mineIndexes.includes(index)
      );
   }

   showNumber(clickedIndex) {
      const showZeroNeighbors = (zeroIndex) => {
         this.getNeighborIndexes(zeroIndex).forEach((neighIndex) => {
            const isConcave =
               this.allCells[neighIndex].className.includes("border--concave");
            if (isConcave) {
               this.showCell(this.allCells[neighIndex]);
               this.showNumber(neighIndex);
            }
         });
      };

      const number = this.indexesCellsNextToMine.filter(
         (index) => index === clickedIndex
      ).length;
      if (number) this.allCells[clickedIndex].textContent = number;
      else {
         this.showCell(this.allCells[clickedIndex]);
         showZeroNeighbors(clickedIndex);
      }
   }
}
export default Cell;
