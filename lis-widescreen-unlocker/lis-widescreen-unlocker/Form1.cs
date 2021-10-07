using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Forms;

namespace lis_widescreen_unlocker
{

    public partial class Form1 : Form
    {
        Dictionary<string, string> WidescreenOptions = new Dictionary<string, string>();

        public Form1()
        {
            WidescreenOptions.Add("1440x900", "CD CC CC 3F");
            WidescreenOptions.Add("1280x1024", "00 00 A0 3F");
            WidescreenOptions.Add("2560x1440", "26 B4 17 40");
            WidescreenOptions.Add("3440x1440", "8E E3 18 40");
            WidescreenOptions.Add("3840x1080", "39 8E 63 40");
            WidescreenOptions.Add("3840x1600", "9A 99 19 40");
            WidescreenOptions.Add("4120x1024", "00 00 A0 3F");
            WidescreenOptions.Add("5120x1440", "39 8E 63 40");
            WidescreenOptions.Add("5292x1050", "AE 47 A1 40");
            WidescreenOptions.Add("7680x1440", "AB AA AA 40");

            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            var path = txtPath.Text;
            // var copypath = txtPath.Text.Replace("Siren-Win64-Shipping.exe", "temp.exe");
            var selected = comboBox1.SelectedItem.ToString().Trim();
            string resolutionHex = WidescreenOptions[selected];

            byte[] find = ConvertHexStringToByteArray(Regex.Replace("3B 8E E3 3F", "0x |[ ,]", string.Empty).Normalize().Trim());
            byte[] replace = ConvertHexStringToByteArray(Regex.Replace(resolutionHex, "0x |[ ,]", string.Empty).Normalize().Trim());
            if (find.Length != replace.Length)
            {
                throw new ArgumentException("Find and replace hex must be same length");
            }
            byte[] bytes = File.ReadAllBytes(path);
            var indexes = Search(bytes, find);
            foreach (int index in indexes)
            {
                for (int i = index, replaceIndex = 0; i < bytes.Length && replaceIndex < replace.Length; i++, replaceIndex++)
                {
                    bytes[i] = replace[replaceIndex];
                }
                
                
            }

            if (chkFovFix.Checked)
            {
                byte[] findFov = ConvertHexStringToByteArray(Regex.Replace("35 FA 0E 3C AC C5 27 37 6F", "0x |[ ,]", string.Empty).Normalize().Trim());
                byte[] replaceFov = ConvertHexStringToByteArray(Regex.Replace("35 FA 3E 3C AC C5 27 37 6F", "0x |[ ,]", string.Empty).Normalize().Trim());

                var indexesFov = Search(bytes, findFov);
                foreach (int index in indexesFov)
                {
                    for (int i = index, replaceIndex = 0; i < bytes.Length && replaceIndex < replaceFov.Length; i++, replaceIndex++)
                    {
                        bytes[i] = replaceFov[replaceIndex];
                    }


                }
            }

            File.WriteAllBytes(path, bytes);
            lblResult.Text = $"Success!";
        }

        int[] Search(byte[] src, byte[] pattern)
        {
            var indexes = new List<int>();
            int maxFirstCharSlot = src.Length - pattern.Length + 1;
            for (int i = 0; i < maxFirstCharSlot; i++)
            {
                if (src[i] != pattern[0]) // compare only first byte
                    continue;

                // found a match on first byte, now try to match rest of the pattern
                for (int j = pattern.Length - 1; j >= 1; j--)
                {
                    if (src[i + j] != pattern[j]) break;
                    if (j == 1) {
                        indexes.Add(i);
                    };
                }
            }
            return indexes.ToArray();
        }

        private static byte[] ConvertHexStringToByteArray(string hexString)
        {
            if (hexString.Length % 2 != 0)
            {
                throw new ArgumentException(String.Format(CultureInfo.InvariantCulture, "The binary key cannot have an odd number of digits: {0}", hexString));
            }

            byte[] data = new byte[hexString.Length / 2];
            for (int index = 0; index < data.Length; index++)
            {
                string byteValue = hexString.Substring(index * 2, 2);
                data[index] = byte.Parse(byteValue, NumberStyles.HexNumber, CultureInfo.InvariantCulture);
            }

            return data;
        }

        private void btnBrowse_Click(object sender, EventArgs e)
        {
            string folderPath = "";
            OpenFileDialog openFileDialog = new OpenFileDialog();
            if (openFileDialog.ShowDialog() == DialogResult.OK)
            {
                txtPath.Text = openFileDialog.FileName;
            }
        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        private void label3_Click(object sender, EventArgs e)
        {

        }
    }
}
