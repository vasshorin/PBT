import React from 'react';

const LicensingPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Software Licensing Agreement</h1>

      <p className="mb-4">
        This Software Licensing Agreement (the "Agreement") is entered into between [Your Company Name] (the "Licensor") and the
        user (the "Licensee") collectively referred to as the "Parties."
      </p>

      <h2 className="text-xl font-bold mb-2">1. Grant of License</h2>
      <p className="mb-4">
        The Licensor grants the Licensee a non-exclusive, non-transferable license to use the software (the "Software") provided
        by the Licensor in accordance with the terms and conditions set forth in this Agreement.
      </p>

      <h2 className="text-xl font-bold mb-2">2. Restrictions</h2>
      <p className="mb-4">
        The Licensee agrees not to:
      </p>
      <ul className="list-disc ml-8 mb-4">
        <li>Copy, modify, or distribute the Software;</li>
        <li>Sublicense, rent, lease, or lend the Software;</li>
        <li>Reverse engineer, decompile, or disassemble the Software;</li>
        <li>Remove or modify any proprietary notices or labels on the Software;</li>
        <li>Use the Software in any manner that violates applicable laws or regulations.</li>
      </ul>

      <h2 className="text-xl font-bold mb-2">3. Intellectual Property Rights</h2>
      <p className="mb-4">
        The Software and any accompanying documentation contain proprietary information and intellectual property of the Licensor.
        The Licensee acknowledges that all right, title, and interest in and to the Software, including any modifications or
        enhancements, are and shall remain the exclusive property of the Licensor.
      </p>

      <h2 className="text-xl font-bold mb-2">4. Warranty Disclaimer</h2>
      <p className="mb-4">
        The Software is provided "as is" without warranty of any kind, either expressed or implied, including, but not limited
        to, the implied warranties of merchantability and fitness for a particular purpose. The Licensor does not warrant that
        the Software will be error-free or that its use will be uninterrupted.
      </p>

      <h2 className="text-xl font-bold mb-2">5. Limitation of Liability</h2>
      <p className="mb-4">
        In no event shall the Licensor be liable for any direct, indirect, incidental, special, exemplary, or consequential
        damages (including, but not limited to, procurement of substitute goods or services, loss of use, data, or profits, or
        business interruption) arising in any way out of the use, inability to use, or performance of the Software, even if the
        Licensor has been advised of the possibility of such damages.
      </p>

      <h2 className="text-xl font-bold mb-2">6. Termination</h2>
      <p className="mb-4">
        This Agreement is effective until terminated. The Licensee may terminate this Agreement at any time by ceasing to use
        the Software and destroying all copies of the Software in its possession. The Licensor may terminate this Agreement if
        the Licensee breaches any of the terms and conditions. Upon termination, the Licensee must cease all use of the Software
        and destroy all copies of the Software in its possession.
      </p>

      <h2 className="text-xl font-bold mb-2">7. Governing Law</h2>
      <p className="mb-4">
        This Agreement shall be governed by and construed in accordance with the laws of [Your Country/State]. Any disputes
        arising under or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts of [Your
        Country/State].
      </p>

      <p className="mb-4">
        By using the Software, the Licensee agrees to be bound by the terms and conditions of this Agreement.
      </p>
    </div>
  );
};

export default LicensingPage;
