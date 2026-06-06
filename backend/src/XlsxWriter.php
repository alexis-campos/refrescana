<?php
declare(strict_types=1);

namespace App;

/**
 * Minimal pure-PHP .xlsx writer (no external dependencies).
 * Supports multiple sheets, bold header row (row 1 auto-styled), string + numeric cells.
 */
class XlsxWriter
{
    /** @var array<array{name:string, rows:array}> */
    private array $sheets = [];

    public function addSheet(string $name, array $rows): void
    {
        $this->sheets[] = ['name' => $name, 'rows' => $rows];
    }

    public function generate(): string
    {
        // Build shared-string table across all sheets
        $strings   = [];
        $stringMap = [];

        foreach ($this->sheets as $sheet) {
            foreach ($sheet['rows'] as $row) {
                foreach ($row as $cell) {
                    if (!is_numeric($cell) || is_string($cell)) {
                        $s = (string)($cell ?? '');
                        if (!array_key_exists($s, $stringMap)) {
                            $stringMap[$s] = count($strings);
                            $strings[]     = $s;
                        }
                    }
                }
            }
        }

        // Build sheet XMLs
        $sheetXmls = [];
        foreach ($this->sheets as $sheet) {
            $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n"
                 . '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>';

            foreach ($sheet['rows'] as $ri => $row) {
                $rowNum  = $ri + 1;
                $isFirst = ($ri === 0);
                $xml    .= "<row r=\"{$rowNum}\">";
                foreach (array_values($row) as $ci => $cell) {
                    $ref = self::colLetter($ci) . $rowNum;
                    if (is_numeric($cell) && !is_string($cell) && $cell !== '') {
                        $xml .= "<c r=\"{$ref}\"><v>" . htmlspecialchars((string)$cell, ENT_XML1) . '</v></c>';
                    } else {
                        $s   = (string)($cell ?? '');
                        $idx = $stringMap[$s] ?? 0;
                        $style = $isFirst ? ' s="1"' : '';
                        $xml .= "<c r=\"{$ref}\" t=\"s\"{$style}><v>{$idx}</v></c>";
                    }
                }
                $xml .= '</row>';
            }
            $xml         .= '</sheetData></worksheet>';
            $sheetXmls[]  = $xml;
        }

        // Shared strings XML
        $ssCount = count($strings);
        $ssXml   = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n"
                 . "<sst xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" count=\"{$ssCount}\" uniqueCount=\"{$ssCount}\">";
        foreach ($strings as $s) {
            $ssXml .= '<si><t xml:space="preserve">' . htmlspecialchars($s, ENT_XML1) . '</t></si>';
        }
        $ssXml .= '</sst>';

        // Styles: index 0 = normal, index 1 = bold (used for header row)
        $stylesXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n"
            . '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
            . '<fonts count="2"><font><sz val="11"/></font><font><b/><sz val="11"/></font></fonts>'
            . '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>'
            . '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
            . '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
            . '<cellXfs count="2">'
            . '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'  // 0 – normal
            . '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0"/>'  // 1 – bold
            . '</cellXfs>'
            . '</styleSheet>';

        // Workbook XML
        $wbXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n"
               . '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
               . ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
               . '<sheets>';
        foreach ($this->sheets as $i => $sheet) {
            $n      = htmlspecialchars($sheet['name'], ENT_XML1);
            $wbXml .= "<sheet name=\"{$n}\" sheetId=\"" . ($i + 1) . "\" r:id=\"rId" . ($i + 1) . "\"/>";
        }
        $wbXml .= '</sheets></workbook>';

        // Workbook rels
        $wbRels = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n"
                . '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
        foreach ($this->sheets as $i => $sheet) {
            $wbRels .= '<Relationship Id="rId' . ($i + 1)
                     . '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"'
                     . ' Target="worksheets/sheet' . ($i + 1) . '.xml"/>';
        }
        $n       = count($this->sheets);
        $wbRels .= '<Relationship Id="rId' . ($n + 1) . '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>';
        $wbRels .= '<Relationship Id="rId' . ($n + 2) . '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>';
        $wbRels .= '</Relationships>';

        // Content types
        $ctXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n"
               . '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
               . '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
               . '<Default Extension="xml" ContentType="application/xml"/>'
               . '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>';
        foreach ($this->sheets as $i => $sheet) {
            $ctXml .= '<Override PartName="/xl/worksheets/sheet' . ($i + 1) . '.xml"'
                    . ' ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
        }
        $ctXml .= '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>'
                . '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
                . '</Types>';

        // Root rels
        $rootRels = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n"
                  . '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
                  . '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
                  . '</Relationships>';

        // Write ZIP to temp file, read back, delete
        $tmpFile = tempnam(sys_get_temp_dir(), 'xlsx');
        $zip = new \ZipArchive();
        $zip->open($tmpFile, \ZipArchive::OVERWRITE);
        $zip->addFromString('[Content_Types].xml', $ctXml);
        $zip->addFromString('_rels/.rels', $rootRels);
        $zip->addFromString('xl/workbook.xml', $wbXml);
        $zip->addFromString('xl/_rels/workbook.xml.rels', $wbRels);
        $zip->addFromString('xl/sharedStrings.xml', $ssXml);
        $zip->addFromString('xl/styles.xml', $stylesXml);
        foreach ($sheetXmls as $i => $xml) {
            $zip->addFromString('xl/worksheets/sheet' . ($i + 1) . '.xml', $xml);
        }
        $zip->close();

        $content = (string)file_get_contents($tmpFile);
        unlink($tmpFile);
        return $content;
    }

    private static function colLetter(int $idx): string
    {
        $name = '';
        $idx++;
        while ($idx > 0) {
            $idx--;
            $name = chr(65 + ($idx % 26)) . $name;
            $idx  = (int)($idx / 26);
        }
        return $name;
    }
}
