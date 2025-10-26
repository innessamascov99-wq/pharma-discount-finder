import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from './ui';
import { searchSupabase } from '../lib/supabase';

interface CSVRow {
  [key: string]: string;
}

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export const DatabaseManage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [selectedTable, setSelectedTable] = useState<'drugs' | 'programs'>('drugs');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState(false);

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
    dosage_form: row.dosage_form || '',
    strength: row.strength || '',
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

          const { error } = await searchSupabase.from(selectedTable).insert(mappedData);

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
      csvContent = 'medication_name,generic_name,manufacturer,drug_class,indication,dosage_form,strength,typical_retail_price,description,side_effects,warnings\n';
      csvContent += 'Lipitor,Atorvastatin,Pfizer,Statin,High Cholesterol,Tablet,10mg-80mg,$200-400/month,Cholesterol medication,Muscle pain,Liver damage risk\n';
    } else {
      csvContent = 'program_name,program_type,manufacturer,description,eligibility_criteria,income_requirements,insurance_requirements,discount_details,program_url,phone_number,email,enrollment_process,required_documents,coverage_duration,renewal_required\n';
      csvContent += 'Sample Copay Card,copay_card,Sample Pharma,Save on medication,Commercial insurance,No income limits,Commercial insurance,Pay as little as $10,https://example.com,1-800-123-4567,info@example.com,Apply online,Prescription,12 months,true\n';
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

  const downloadDatabaseData = async () => {
    setDownloading(true);
    try {
      const { data, error } = await searchSupabase
        .from(selectedTable)
        .select('*')
        .eq('active', true);

      if (error) throw error;

      if (!data || data.length === 0) {
        alert(`No data found in ${selectedTable} table`);
        return;
      }

      let csvContent = '';
      const escapeCsv = (val: any) => {
        if (val === null || val === undefined) return '';
        const str = String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      };

      if (selectedTable === 'drugs') {
        csvContent = 'medication_name,generic_name,manufacturer,drug_class,indication,dosage_form,strength,typical_retail_price,description,side_effects,warnings\n';
        data.forEach((row: any) => {
          csvContent += `${escapeCsv(row.medication_name)},${escapeCsv(row.generic_name)},${escapeCsv(row.manufacturer)},${escapeCsv(row.drug_class)},${escapeCsv(row.indication)},${escapeCsv(row.dosage_form)},${escapeCsv(row.strength)},${escapeCsv(row.typical_retail_price)},${escapeCsv(row.description)},${escapeCsv(row.side_effects)},${escapeCsv(row.warnings)}\n`;
        });
      } else {
        csvContent = 'program_name,program_type,manufacturer,description,eligibility_criteria,income_requirements,insurance_requirements,discount_details,program_url,phone_number,email,enrollment_process,required_documents,coverage_duration,renewal_required\n';
        data.forEach((row: any) => {
          csvContent += `${escapeCsv(row.program_name)},${escapeCsv(row.program_type)},${escapeCsv(row.manufacturer)},${escapeCsv(row.description)},${escapeCsv(row.eligibility_criteria)},${escapeCsv(row.income_requirements)},${escapeCsv(row.insurance_requirements)},${escapeCsv(row.discount_details)},${escapeCsv(row.program_url)},${escapeCsv(row.phone_number)},${escapeCsv(row.email)},${escapeCsv(row.enrollment_process)},${escapeCsv(row.required_documents)},${escapeCsv(row.coverage_duration)},${row.renewal_required}\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTable}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(`Download failed: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const clearData = () => {
    setCsvData([]);
    setHeaders([]);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Data Management</h2>
          <p className="text-sm text-muted-foreground">Import and export database records</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={selectedTable === 'drugs' ? 'default' : 'outline'}
            onClick={() => {
              setSelectedTable('drugs');
              clearData();
            }}
          >
            Drugs
          </Button>
          <Button
            size="sm"
            variant={selectedTable === 'programs' ? 'default' : 'outline'}
            onClick={() => {
              setSelectedTable('programs');
              clearData();
            }}
          >
            Programs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-sm">Download Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={downloadDatabaseData}
              disabled={downloading}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export {selectedTable} Data
            </Button>
            <Button
              onClick={downloadTemplate}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <CardTitle className="text-sm">Upload Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Drop CSV file or click to browse</p>
              <p className="text-xs text-muted-foreground">CSV files only</p>
            </div>

            {csvData.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">File Loaded</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {csvData.length} rows • {headers.length} columns
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1"
                    size="sm"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      `Upload to ${selectedTable}`
                    )}
                  </Button>
                  <Button onClick={clearData} variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {uploadResult && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Upload Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium">Success</span>
                </div>
                <p className="text-xl font-bold text-emerald-600">{uploadResult.success}</p>
              </div>

              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">Failed</span>
                </div>
                <p className="text-xl font-bold text-red-600">{uploadResult.failed}</p>
              </div>
            </div>

            {uploadResult.errors.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium">Errors (first 10)</span>
                </div>
                <div className="space-y-0.5 max-h-32 overflow-y-auto">
                  {uploadResult.errors.map((error, index) => (
                    <p key={index} className="text-xs text-amber-700 dark:text-amber-300">
                      • {error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
