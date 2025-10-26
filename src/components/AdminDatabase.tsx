import React, { useState, useRef } from 'react';
import {
  Database,
  Upload,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Search,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
} from './ui';
import { searchSupabase } from '../lib/supabase';
import { searchDrugs, Drug } from '../services/searchService';

interface CSVRow {
  [key: string]: string;
}

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export const AdminDatabase: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [selectedTable, setSelectedTable] = useState<'drugs' | 'programs'>('drugs');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const parseCSV = (text: string): { headers: string[]; rows: CSVRow[] } => {
    const lines = text.split('\n').filter((line) => line.trim());
    if (lines.length === 0) return { headers: [], rows: [] };

    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    return { headers, rows };
  };

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    const text = await file.text();
    const { headers: parsedHeaders, rows } = parseCSV(text);

    setHeaders(parsedHeaders);
    setCsvData(rows);
    setUploadResult(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const validateDrugRow = (row: CSVRow): string | null => {
    if (!row.medication_name) return 'Missing medication_name';
    if (!row.generic_name) return 'Missing generic_name';
    if (!row.manufacturer) return 'Missing manufacturer';
    if (!row.drug_class) return 'Missing drug_class';
    return null;
  };

  const validateProgramRow = (row: CSVRow): string | null => {
    if (!row.program_name) return 'Missing program_name';
    if (!row.manufacturer) return 'Missing manufacturer';
    if (!row.program_type) return 'Missing program_type';
    return null;
  };

  const mapDrugRow = (row: CSVRow) => ({
    medication_name: row.medication_name,
    generic_name: row.generic_name,
    manufacturer: row.manufacturer,
    drug_class: row.drug_class,
    indication: row.indication || '',
    dosage_forms: row.dosage_forms || '',
    common_dosages: row.common_dosages || '',
    typical_retail_price: row.typical_retail_price || '',
    description: row.description || '',
    side_effects: row.side_effects || '',
    warnings: row.warnings || '',
    active: true,
  });

  const mapProgramRow = (row: CSVRow) => ({
    program_name: row.program_name,
    program_type: row.program_type || 'copay_card',
    description: row.description || '',
    manufacturer: row.manufacturer,
    eligibility_criteria: row.eligibility_criteria || '',
    income_requirements: row.income_requirements || '',
    insurance_requirements: row.insurance_requirements || '',
    discount_details: row.discount_details || '',
    program_url: row.program_url || '',
    phone_number: row.phone_number || '',
    email: row.email || '',
    enrollment_process: row.enrollment_process || '',
    required_documents: row.required_documents || '',
    coverage_duration: row.coverage_duration || '12 months',
    renewal_required: row.renewal_required === 'true' || row.renewal_required === '1',
    active: true,
  });

  const handleUpload = async () => {
    if (csvData.length === 0) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    const errors: string[] = [];
    let successCount = 0;
    let failedCount = 0;

    try {
      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];

        try {
          let validationError: string | null = null;
          let mappedData: any;

          if (selectedTable === 'drugs') {
            validationError = validateDrugRow(row);
            mappedData = mapDrugRow(row);
          } else {
            validationError = validateProgramRow(row);
            mappedData = mapProgramRow(row);
          }

          if (validationError) {
            errors.push(`Row ${i + 2}: ${validationError}`);
            failedCount++;
            continue;
          }

          const { error } = await searchSupabase
            .from(selectedTable)
            .insert(mappedData);

          if (error) {
            errors.push(`Row ${i + 2}: ${error.message}`);
            failedCount++;
          } else {
            successCount++;
          }
        } catch (err: any) {
          errors.push(`Row ${i + 2}: ${err.message}`);
          failedCount++;
        }
      }

      setUploadResult({
        success: successCount,
        failed: failedCount,
        errors: errors.slice(0, 10),
      });
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    let csvContent = '';

    if (selectedTable === 'drugs') {
      csvContent = 'medication_name,generic_name,manufacturer,drug_class,indication,dosage_forms,common_dosages,typical_retail_price,description,side_effects,warnings\n';
      csvContent += 'Lipitor,Atorvastatin,Pfizer,Statin,High Cholesterol,Tablet,10mg-80mg,$200-400/month,Cholesterol-lowering medication,Muscle pain,Liver damage risk\n';
    } else {
      csvContent = 'program_name,program_type,manufacturer,description,eligibility_criteria,income_requirements,insurance_requirements,discount_details,program_url,phone_number,email,enrollment_process,required_documents,coverage_duration,renewal_required\n';
      csvContent += 'Sample Copay Card,copay_card,Sample Pharma,Save on medication,Commercial insurance required,No income limits,Commercial insurance,Pay as little as $10,https://example.com,1-800-123-4567,info@example.com,Apply online,Prescription,12 months,true\n';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTable}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearData = () => {
    setCsvData([]);
    setHeaders([]);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setSearching(true);
    setSearchError(null);

    try {
      const results = await searchDrugs(query);
      setSearchResults(results);
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchError(err.message || 'Failed to search drugs');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Database Management</h2>
          <p className="text-muted-foreground">Search, upload and manage database records</p>
        </div>
        <Button onClick={downloadTemplate} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download Template
        </Button>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">Search Database</CardTitle>
              <CardDescription className="text-xs">
                Search for drugs in the database
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <div className="relative bg-muted/50 border-2 border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-4 px-6 py-4">
                  {searching ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
                  ) : (
                    <Search className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by medication name..."
                    className="flex-1 bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                    autoComplete="off"
                  />
                  {searchQuery && !searching && (
                    <button
                      onClick={() => handleSearch('')}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <div className="px-6 pb-4 text-sm text-muted-foreground">
                    Type at least 2 characters to search
                  </div>
                )}
              </div>
            </div>

            {searchError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <p className="text-destructive text-sm font-medium">{searchError}</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="text-left py-2 px-4 font-semibold">Medication</th>
                        <th className="text-left py-2 px-4 font-semibold">Generic Name</th>
                        <th className="text-left py-2 px-4 font-semibold">Manufacturer</th>
                        <th className="text-left py-2 px-4 font-semibold">Drug Class</th>
                        <th className="text-left py-2 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((drug, index) => (
                        <tr key={drug.id || index} className="border-t hover:bg-muted/50">
                          <td className="py-2 px-4 font-medium">{drug.medication_name}</td>
                          <td className="py-2 px-4">{drug.generic_name}</td>
                          <td className="py-2 px-4">{drug.manufacturer}</td>
                          <td className="py-2 px-4">{drug.drug_class}</td>
                          <td className="py-2 px-4">
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-0">
                              Active
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-muted/50 py-2 px-4 text-center text-sm text-muted-foreground">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}

            {searchQuery.length >= 2 && !searching && searchResults.length === 0 && !searchError && (
              <div className="text-center py-8 text-muted-foreground">
                No drugs found matching "{searchQuery}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Select Target Table</CardTitle>
              <CardDescription className="text-xs">
                Choose which table to upload data to
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedTable === 'drugs' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedTable('drugs');
                  clearData();
                }}
                size="sm"
              >
                Drugs Table
              </Button>
              <Button
                variant={selectedTable === 'programs' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedTable('programs');
                  clearData();
                }}
                size="sm"
              >
                Programs Table
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">Upload CSV File</CardTitle>
              <CardDescription className="text-xs">
                Upload data to the {selectedTable} table
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold text-lg mb-2">
              Drop your CSV file here
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click the button below to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Browse Files
            </Button>
          </div>

          {csvData.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Preview</h4>
                  <p className="text-sm text-muted-foreground">
                    {csvData.length} rows loaded
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={clearData} variant="outline" size="sm">
                    Clear
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    size="sm"
                    className="gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload to Database
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        {headers.map((header, index) => (
                          <th
                            key={index}
                            className="text-left py-2 px-4 font-semibold"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 10).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t hover:bg-muted/50">
                          {headers.map((header, colIndex) => (
                            <td key={colIndex} className="py-2 px-4">
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {csvData.length > 10 && (
                  <div className="bg-muted/50 py-2 px-4 text-center text-sm text-muted-foreground">
                    Showing first 10 of {csvData.length} rows
                  </div>
                )}
              </div>
            </div>
          )}

          {uploadResult && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    {uploadResult.failed === 0 ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        Upload Successful
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        Upload Completed with Errors
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Successful records:</span>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-0">
                        {uploadResult.success}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Failed records:</span>
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-0">
                        {uploadResult.failed}
                      </Badge>
                    </div>
                    {uploadResult.errors.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-semibold text-sm mb-2">
                          First {Math.min(10, uploadResult.errors.length)} Errors:
                        </h5>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {uploadResult.errors.map((error, index) => (
                            <div
                              key={index}
                              className="text-xs text-red-600 dark:text-red-400 flex items-start gap-2"
                            >
                              <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{error}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-blue-900 dark:text-blue-300">
                Important Notes
              </p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-400">
                <li>CSV files must have column headers matching the database schema</li>
                <li>Download the template to see the required format</li>
                <li>All uploads are linked to the search database</li>
                <li>Duplicate entries may be rejected based on unique constraints</li>
                <li>Large files may take several minutes to process</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
