
import "./domainDoc.js"

/**
 * Interface for service.
 *
 * @typedef { Object } TableService
 *
 * Fetches a single data entry.
 * Applies the given filter to the data set and returns the entry
 * with the given index from that filtered subset.
 * @property { function(?Filter, !number) : Promise<Entry> }  getSingleDataEntry
 *
 * Applies the given filter to the data set and returns a batch of entries
 * ranging from startIndex to endIndex from that filtered subset.
 * The 2nd parameter contains the startIndex of the batch.
 * The 3rd parameter contains the endIndex of the batch.
 * Since the table component does not know the data size of a filtered subset at the time of the fetch,
 * the passed endIndex could be out of bound. This must be handled by the service. In this case
 * the endIndex should be replaced with the highest possible index.
 * As 1st value, the array of entries matching the filter and indices must be returned.
 * As a 2nd value, the length of the filtered subset must be returned.
 * As a 3rd value, the length of the original, unfiltered data must be returned.
 * All 3 values must be returned as an Array of promises:
 * Promise.all([filteredDataSubsetPromise, filteredDataSubsetSizePromise, totalDataSizePromise])
 * @property { function(!Filter, !number, !number) : PromiseConstructor }  getDataWithFilter
 */